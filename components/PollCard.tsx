'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { vote, getPollOptions, hasVoted, getCreatorBetOption, finalizePoll, getPollExtended } from '@/utils/contract';
import { getSigner, formatEther } from '@/utils/wallet';
import { votingLimiter, getClientIdentifier, formatTimeRemaining } from '@/utils/rateLimit';

interface PollCardProps {
  pollId: number;
  question: string;
  creator: string;
  expiresAt: bigint;
  finalized: boolean;
  totalVotes: bigint;
  totalFunds: bigint;
  hasBet: boolean;
  userAddress: string | null;
  onVoteSuccess?: () => void;
}

export default function PollCard({
  pollId,
  question,
  creator,
  expiresAt,
  finalized,
  totalVotes,
  totalFunds,
  hasBet,
  userAddress,
  onVoteSuccess,
}: PollCardProps) {
  const [options, setOptions] = useState<{ text: string; votes: number }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const [creatorBet, setCreatorBet] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [alreadyVotedError, setAlreadyVotedError] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [finalizedAt, setFinalizedAt] = useState<bigint | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [timeUntilCleanup, setTimeUntilCleanup] = useState<string>('');

  useEffect(() => {
    loadPollData();
    const interval = setInterval(() => {
      updateTimeRemaining();
      if (finalized && finalizedAt) {
        updateCleanupTime();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pollId, userAddress, finalized, finalizedAt]);

  const loadPollData = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/'
      );

      const [texts, votes] = await getPollOptions(provider, pollId);
      setOptions(texts.map((text: string, idx: number) => ({
        text,
        votes: Number(votes[idx])
      })));

      // Get finalized timestamp if poll is finalized
      if (finalized) {
        try {
          const pollExtended = await getPollExtended(provider, pollId);
          setFinalizedAt(pollExtended.finalizedAt);
        } catch (error) {
          console.log('Error fetching finalized timestamp');
        }
      }

      if (userAddress) {
        const voted = await hasVoted(provider, pollId, userAddress);
        setUserVoted(voted);

        if (creator.toLowerCase() === userAddress.toLowerCase() && hasBet) {
          try {
            const signer = await getSigner();
            if (signer) {
              const betIndex = await getCreatorBetOption(signer, pollId);
              setCreatorBet(Number(betIndex));
            }
          } catch (error) {
            console.log('Not creator or error fetching bet');
          }
        }
      }
    } catch (error) {
      console.error('Error loading poll:', error);
    }
  };

  const updateTimeRemaining = () => {
    const now = Math.floor(Date.now() / 1000);
    const expires = Number(expiresAt);
    const remaining = expires - now;

    if (remaining <= 0) {
      setTimeRemaining('Ended');
      return;
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      setTimeRemaining(`${minutes}m`);
    }
  };

  const updateCleanupTime = () => {
    if (!finalizedAt) return;

    const now = Math.floor(Date.now() / 1000);
    const finalized = Number(finalizedAt);
    const cleanupTime = finalized + (24 * 60 * 60); // 24 hours
    const remaining = cleanupTime - now;

    if (remaining <= 0) {
      setTimeUntilCleanup('Expiring soon');
      return;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (hours > 0) {
      setTimeUntilCleanup(`${hours}h ${minutes}m remaining`);
    } else {
      setTimeUntilCleanup(`${minutes}m remaining`);
    }
  };

  const handleFinalize = async () => {
    if (!userAddress) return;

    setIsFinalizing(true);
    setFinalizeError(null);

    try {
      const signer = await getSigner();
      if (!signer) {
        setFinalizeError('Please connect your wallet');
        return;
      }

      await finalizePoll(signer, pollId);
      await loadPollData();
      if (onVoteSuccess) onVoteSuccess();
    } catch (error: any) {
      console.error('Error finalizing poll:', error);
      setFinalizeError('Failed to finalize poll. Please try again.');
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null || !userAddress) return;

    setIsVoting(true);
    setVoteError(null);

    try {
      const signer = await getSigner();
      if (!signer) {
        setVoteError('Please connect your wallet');
        return;
      }

      // Rate limiting check
      const identifier = getClientIdentifier(userAddress);
      const rateLimitResult = votingLimiter.checkLimit(identifier, 'vote');

      if (!rateLimitResult.allowed) {
        if (rateLimitResult.blocked) {
          const timeLeft = formatTimeRemaining(rateLimitResult.blockUntil! - Date.now());
          setVoteError(`You've been temporarily blocked due to excessive voting attempts. Try again in ${timeLeft}.`);
          setIsVoting(false);
          return;
        }
        const timeLeft = formatTimeRemaining(rateLimitResult.resetTime - Date.now());
        setVoteError(`You're voting too quickly. Please wait ${timeLeft} before trying again.`);
        setIsVoting(false);
        return;
      }

      const result = await vote(signer, pollId, selectedOption);
      if (result.txHash) {
        setTxHash(result.txHash);
      }
      setUserVoted(true);
      await loadPollData();
      if (onVoteSuccess) onVoteSuccess();
    } catch (error: any) {
      const errorMessage = error.message || '';

      if (errorMessage === 'ALREADY_VOTED') {
        setAlreadyVotedError(true);
      } else if (errorMessage === 'TIMEOUT') {
        setVoteError('Wallet connection timed out. Please check MetaMask is responding and try again.');
      } else if (errorMessage === 'INSUFFICIENT_BALANCE') {
        setVoteError('Insufficient balance. You need at least 0.001 ETH plus gas fees to vote.');
      } else if (errorMessage === 'USER_REJECTED') {
        setVoteError('Transaction was cancelled.');
      } else if (errorMessage === 'NETWORK_ERROR') {
        setVoteError('Network error. Please check your connection and try again.');
      } else if (errorMessage === 'POLL_EXPIRED') {
        setVoteError('This poll has expired and is no longer accepting votes.');
      } else if (errorMessage === 'POLL_FINALIZED') {
        setVoteError('This poll has been finalized and is no longer accepting votes.');
      } else if (errorMessage === 'INVALID_OPTION') {
        setVoteError('Invalid voting option. Please refresh and try again.');
      } else {
        setVoteError('Transaction failed. Please try again.');
      }
    } finally {
      setIsVoting(false);
    }
  };

  const getPercentage = (votes: number) => {
    const total = Number(totalVotes);
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getWinningOption = () => {
    if (!finalized) return null;
    let maxVotes = 0;
    let winningIdx = 0;
    options.forEach((opt, idx) => {
      if (opt.votes > maxVotes) {
        maxVotes = opt.votes;
        winningIdx = idx;
      }
    });
    return winningIdx;
  };

  const getWinningMargin = () => {
    if (!finalized || options.length === 0) return null;

    const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);
    if (sortedOptions.length < 2) return null;

    const winnerVotes = sortedOptions[0].votes;
    const runnerUpVotes = sortedOptions[1].votes;
    const margin = winnerVotes - runnerUpVotes;

    return margin;
  };

  const winningOption = getWinningOption();
  const winningMargin = getWinningMargin();
  const isCreator = userAddress && creator.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 touch-manipulation">
      <div className="flex justify-between items-start mb-4 sm:mb-5">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex-1 mr-3 sm:mr-4 leading-tight">{question}</h3>
        <span className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shadow-md flex-shrink-0 ${
          finalized
            ? 'bg-gray-100 text-gray-700 border border-gray-300'
            : 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
        }`}>
          {finalized ? '✓ Ended' : `⏱ ${timeRemaining}`}
        </span>
      </div>

      {finalized && winningMargin !== null && (
        <div className="mb-4 sm:mb-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
          <p className="text-sm sm:text-base font-semibold text-green-800">
            🏆 Won by <span className="text-green-900 font-bold">{winningMargin}</span> vote{winningMargin !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {finalized && timeUntilCleanup && (
        <div className="mb-4 sm:mb-5 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-3 sm:p-4">
          <p className="text-sm sm:text-base font-semibold text-orange-800 flex items-center gap-2">
            <span>⏰</span>
            <span>This poll will be archived in <span className="text-orange-900 font-bold">{timeUntilCleanup}</span></span>
          </p>
        </div>
      )}

      {isCreator && (
        <div className="mb-4 sm:mb-5 flex flex-wrap gap-2 text-xs sm:text-sm md:text-base">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-accent-50 to-accent-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 border-accent-200 shadow-sm">
            <span className="text-accent-700">💰 Pool:</span>
            <span className="font-bold text-accent-900">{formatEther(totalFunds)} ETH</span>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
        {options.map((option, idx) => {
          const percentage = getPercentage(option.votes);
          const isWinner = finalized && winningOption === idx;
          const isCreatorBet = creatorBet === idx;

          return (
            <div key={idx} className="relative touch-manipulation">
              <div
                className={`relative overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 transition-all duration-200 min-h-[64px] sm:min-h-[72px] ${
                  selectedOption === idx
                    ? 'border-purple-500 shadow-lg shadow-purple-200 scale-[1.02]'
                    : isWinner
                    ? 'border-green-500 shadow-lg shadow-green-200'
                    : 'border-gray-200 active:border-purple-400'
                } ${
                  !finalized && !userVoted ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => !finalized && !userVoted && setSelectedOption(idx)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-100/70 to-blue-100/70 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between items-center p-4 sm:p-5 gap-3">
                  <div className="flex items-center flex-wrap gap-2 flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg break-words">
                      {option.text}
                    </span>
                    {isCreatorBet && isCreator && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 text-xs sm:text-sm rounded-full font-bold shadow-sm border border-yellow-400 whitespace-nowrap">
                        🎯 Your Bet
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-2 py-1 bg-gradient-to-r from-green-200 to-green-300 text-green-900 text-xs sm:text-sm rounded-full font-bold shadow-sm border border-green-400 whitespace-nowrap">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="font-black text-purple-700 text-xl sm:text-2xl md:text-3xl leading-tight">
                        {percentage}%
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
                        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!finalized && timeRemaining === 'Ended' && isCreator && hasBet && userAddress && (
        <button
          onClick={handleFinalize}
          disabled={isFinalizing}
          className={`relative w-full group touch-manipulation min-h-[56px] sm:min-h-[64px] mb-4 ${isFinalizing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl blur transition-opacity ${isFinalizing ? 'opacity-50' : 'opacity-75 group-active:opacity-100'}`}></div>
          <div className={`relative bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-base sm:text-lg md:text-xl py-4 sm:py-5 px-4 rounded-xl shadow-lg transition-all ${!isFinalizing ? 'active:shadow-2xl' : ''}`}>
            {isFinalizing ? '⏳ Claiming Reward...' : '🎁 Claim Your Reward'}
          </div>
        </button>
      )}

      {finalizeError && !finalized && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4 sm:p-5 text-center shadow-lg mb-4">
          <p className="text-red-800 font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Error</span>
          </p>
          <p className="text-xs sm:text-sm md:text-base text-red-700 mt-2 sm:mt-3 px-2 leading-relaxed">{finalizeError}</p>
          <button
            onClick={() => setFinalizeError(null)}
            className="mt-4 sm:mt-5 text-sm sm:text-base text-red-600 active:text-red-800 font-semibold underline touch-manipulation min-h-[44px] px-4 py-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {!finalized && !userVoted && !alreadyVotedError && userAddress && timeRemaining !== 'Ended' && (
        <button
          onClick={handleVote}
          disabled={selectedOption === null || isVoting}
          className={`relative w-full group touch-manipulation min-h-[56px] sm:min-h-[64px] ${selectedOption === null || isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl blur transition-opacity ${selectedOption === null ? 'opacity-50' : 'opacity-75 group-active:opacity-100'}`}></div>
          <div className={`relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base sm:text-lg md:text-xl py-4 sm:py-5 px-4 rounded-xl shadow-lg transition-all ${selectedOption !== null && !isVoting ? 'active:shadow-2xl' : ''}`}>
            {isVoting ? '⏳ Submitting Vote...' : selectedOption === null ? '🗳️ Select an option to vote' : `🗳️ Cast Your Vote (${formatEther(BigInt('1000000000000000'))} ETH)`}
          </div>
        </button>
      )}

      {(userVoted || alreadyVotedError) && !finalized && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-4 sm:p-5 text-center shadow-lg">
          <p className="text-emerald-800 font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{alreadyVotedError ? 'Already voted from this wallet!' : 'Your vote has been recorded!'}</span>
          </p>
          {alreadyVotedError && (
            <p className="text-xs sm:text-sm text-emerald-700 mt-2 sm:mt-3">
              You voted from another account. Each wallet can only vote once.
            </p>
          )}
          {txHash && !alreadyVotedError && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-emerald-600 active:text-emerald-800 mt-3 sm:mt-4 inline-block underline font-semibold touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              View transaction
            </a>
          )}
        </div>
      )}

      {voteError && !finalized && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4 sm:p-5 text-center shadow-lg">
          <p className="text-red-800 font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Error</span>
          </p>
          <p className="text-xs sm:text-sm md:text-base text-red-700 mt-2 sm:mt-3 px-2 leading-relaxed">{voteError}</p>
          <button
            onClick={() => setVoteError(null)}
            className="mt-4 sm:mt-5 text-sm sm:text-base text-red-600 active:text-red-800 font-semibold underline touch-manipulation min-h-[44px] px-4 py-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {!userAddress && !finalized && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-4 sm:p-5 text-center shadow-md">
          <p className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Connect wallet to participate</span>
          </p>
        </div>
      )}
    </div>
  );
}

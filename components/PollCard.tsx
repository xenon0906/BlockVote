'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { vote, getPollOptions, hasVoted, getCreatorBetOption } from '@/utils/contract';
import { getSigner, formatEther } from '@/utils/wallet';

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

  useEffect(() => {
    loadPollData();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [pollId, userAddress]);

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

  const handleVote = async () => {
    if (selectedOption === null || !userAddress) return;

    setIsVoting(true);
    try {
      const signer = await getSigner();
      if (!signer) {
        alert('Please connect your wallet');
        return;
      }

      await vote(signer, pollId, selectedOption);
      setUserVoted(true);
      await loadPollData();
      if (onVoteSuccess) onVoteSuccess();
    } catch (error: any) {
      const errorMessage = error.message || '';

      if (errorMessage.includes('Already voted') || errorMessage.includes('already voted')) {
        setAlreadyVotedError(true);
      } else {
        alert(errorMessage || 'Failed to vote');
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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-purple-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1 mr-4 leading-tight">{question}</h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md ${
          finalized
            ? 'bg-gray-100 text-gray-700 border border-gray-300'
            : 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
        }`}>
          {finalized ? '✓ Ended' : `⏱ ${timeRemaining}`}
        </span>
      </div>

      {finalized && winningMargin !== null && (
        <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-green-800">
            🏆 Won by <span className="text-green-900 font-bold">{winningMargin}</span> vote{winningMargin !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {isCreator && (
        <div className="mb-4 flex flex-wrap gap-2 text-xs md:text-sm">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-accent-50 to-accent-100 px-3 py-1.5 rounded-full border border-accent-200">
            <span className="text-accent-700">💰 Pool:</span>
            <span className="font-bold text-accent-900">{formatEther(totalFunds)} ETH</span>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {options.map((option, idx) => {
          const percentage = getPercentage(option.votes);
          const isWinner = finalized && winningOption === idx;
          const isCreatorBet = creatorBet === idx;

          return (
            <div key={idx} className="relative">
              <div
                className={`relative overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 transition-all duration-300 ${
                  selectedOption === idx
                    ? 'border-purple-500 shadow-lg shadow-purple-200'
                    : isWinner
                    ? 'border-green-500 shadow-lg shadow-green-200'
                    : 'border-gray-200 hover:border-purple-300'
                } ${
                  !finalized && !userVoted ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => !finalized && !userVoted && setSelectedOption(idx)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-100/70 to-blue-100/70 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between items-center p-4">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      {option.text}
                    </span>
                    {isCreatorBet && isCreator && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 text-xs rounded-full font-bold shadow-sm border border-yellow-400">
                        🎯 Your Bet
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-green-200 to-green-300 text-green-900 text-xs rounded-full font-bold shadow-sm border border-green-400">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-black text-purple-700 text-lg md:text-xl">
                        {percentage}%
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
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

      {!finalized && !userVoted && !alreadyVotedError && userAddress && (
        <button
          onClick={handleVote}
          disabled={selectedOption === null || isVoting}
          className={`relative w-full group ${selectedOption === null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl blur transition-opacity ${selectedOption === null ? 'opacity-50' : 'opacity-75 group-hover:opacity-100'}`}></div>
          <div className={`relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm md:text-base py-3 rounded-xl shadow-lg transition-all ${selectedOption !== null && !isVoting ? 'hover:shadow-xl hover:scale-[1.02]' : ''}`}>
            {isVoting ? '⏳ Submitting Vote...' : selectedOption === null ? '🗳️ Select an option to vote' : `🗳️ Cast Your Vote (${formatEther(BigInt('1000000000000000'))} ETH)`}
          </div>
        </button>
      )}

      {(userVoted || alreadyVotedError) && !finalized && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-4 text-center shadow-lg">
          <p className="text-emerald-800 font-bold text-sm md:text-base flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{alreadyVotedError ? 'Already voted from this wallet!' : 'Your vote has been recorded!'}</span>
          </p>
          {alreadyVotedError && (
            <p className="text-xs text-emerald-700 mt-2">
              You voted from another account. Each wallet can only vote once.
            </p>
          )}
        </div>
      )}

      {!userAddress && !finalized && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center shadow-md">
          <p className="text-gray-700 font-semibold text-sm md:text-base flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Connect wallet to participate</span>
          </p>
        </div>
      )}
    </div>
  );
}

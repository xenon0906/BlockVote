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
      alert(error.message || 'Failed to vote');
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
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1 mr-4 leading-tight">{question}</h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm ${
          finalized ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
        }`}>
          {finalized ? 'Ended' : `⏱ ${timeRemaining}`}
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
                className={`poll-option ${
                  selectedOption === idx ? 'poll-option-selected border-2 border-primary-500 shadow-md' : ''
                } ${isWinner ? 'border-2 border-green-500 bg-green-50 shadow-lg' : ''} ${
                  !finalized && !userVoted ? 'hover:scale-[1.02] hover:shadow-md cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => !finalized && !userVoted && setSelectedOption(idx)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary-100/60 to-accent-100/60 transition-all duration-500 rounded-lg"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-medium text-gray-900 text-sm md:text-base">
                      {option.text}
                    </span>
                    {isCreatorBet && isCreator && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 text-xs rounded-full font-semibold shadow-sm border border-yellow-400">
                        🎯 Your Bet
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-green-200 to-green-300 text-green-900 text-xs rounded-full font-semibold shadow-sm border border-green-400">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary-700 text-base md:text-lg">
                        {percentage}%
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 font-medium">
                        ({option.votes} votes)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!finalized && !userVoted && userAddress && (
        <button
          onClick={handleVote}
          disabled={selectedOption === null || isVoting}
          className="btn-primary w-full text-sm md:text-base shadow-lg hover:shadow-xl transition-shadow"
        >
          {isVoting ? '⏳ Voting...' : `✅ Vote (${formatEther(BigInt('1000000000000000'))} ETH)`}
        </button>
      )}

      {userVoted && !finalized && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-3 text-center shadow-sm">
          <p className="text-blue-800 font-semibold text-sm md:text-base">✓ You voted on this poll</p>
        </div>
      )}

      {!userAddress && !finalized && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-3 text-center shadow-sm">
          <p className="text-gray-700 font-medium text-sm md:text-base">🔒 Connect wallet to vote</p>
        </div>
      )}
    </div>
  );
}

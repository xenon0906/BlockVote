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

  const winningOption = getWinningOption();
  const isCreator = userAddress && creator.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1 mr-4">{question}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          finalized ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
        }`}>
          {finalized ? 'Ended' : timeRemaining}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs md:text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span>Votes:</span>
          <span className="font-semibold text-primary-600">{totalVotes.toString()}</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center space-x-1">
          <span>Pool:</span>
          <span className="font-semibold text-accent-600">{formatEther(totalFunds)} ETH</span>
        </div>
        {hasBet && (
          <>
            <span className="text-gray-300">•</span>
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              Creator Bet
            </span>
          </>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {options.map((option, idx) => {
          const percentage = getPercentage(option.votes);
          const isWinner = finalized && winningOption === idx;
          const isCreatorBet = creatorBet === idx;

          return (
            <div key={idx} className="relative">
              <div
                className={`poll-option ${
                  selectedOption === idx ? 'poll-option-selected' : ''
                } ${isWinner ? 'border-green-500 bg-green-50' : ''} ${
                  !finalized && !userVoted ? 'hover:scale-[1.02]' : ''
                }`}
                onClick={() => !finalized && !userVoted && setSelectedOption(idx)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-accent-100/50 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-medium text-gray-900 text-sm md:text-base">
                      {option.text}
                    </span>
                    {isCreatorBet && isCreator && (
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                        Your Bet
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                        Winner
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-700 text-sm md:text-base">
                      {percentage}%
                    </div>
                    <div className="text-xs text-gray-500">{option.votes} votes</div>
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
          className="btn-primary w-full text-sm md:text-base"
        >
          {isVoting ? 'Voting...' : `Vote (${formatEther(BigInt('1000000000000000'))} ETH)`}
        </button>
      )}

      {userVoted && !finalized && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-blue-700 font-medium text-sm md:text-base">You voted on this poll</p>
        </div>
      )}

      {!userAddress && !finalized && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-gray-600 text-sm md:text-base">Connect wallet to vote</p>
        </div>
      )}
    </div>
  );
}

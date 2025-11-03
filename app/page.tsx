'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import PollCard from '@/components/PollCard';
import CreatePollModal from '@/components/CreatePollModal';
import { getActivePolls, getCompletedPolls, getPoll } from '@/utils/contract';

interface Poll {
  id: number;
  question: string;
  creator: string;
  createdAt: bigint;
  expiresAt: bigint;
  finalized: boolean;
  totalVotes: bigint;
  totalFunds: bigint;
  hasBet: boolean;
}

export default function Home() {
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [completedPolls, setCompletedPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    loadPolls();
    checkWalletConnection();

    const interval = setInterval(loadPolls, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setUserAddress(accounts.length > 0 ? accounts[0] : null);
        });
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const loadPolls = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/'
      );

      const [activeIds, completedIds] = await Promise.all([
        getActivePolls(provider, 50),
        getCompletedPolls(provider, 20),
      ]);

      const activeData = await Promise.all(
        activeIds.map(async (id: bigint) => {
          const data = await getPoll(provider, Number(id));
          return {
            id: Number(data[0]),
            question: data[1],
            creator: data[2],
            createdAt: data[3],
            expiresAt: data[4],
            finalized: data[5],
            totalVotes: data[6],
            totalFunds: data[7],
            hasBet: data[8],
          };
        })
      );

      const completedData = await Promise.all(
        completedIds.map(async (id: bigint) => {
          const data = await getPoll(provider, Number(id));
          return {
            id: Number(data[0]),
            question: data[1],
            creator: data[2],
            createdAt: data[3],
            expiresAt: data[4],
            finalized: data[5],
            totalVotes: data[6],
            totalFunds: data[7],
            hasBet: data[8],
          };
        })
      );

      setActivePolls(activeData);
      setCompletedPolls(completedData);
    } catch (error) {
      console.error('Error loading polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingPolls = () => {
    if (activePolls.length < 9) return [];
    return [...activePolls]
      .sort((a, b) => Number(b.totalVotes) - Number(a.totalVotes))
      .slice(0, 3);
  };

  const trendingPolls = getTrendingPolls();
  const trendingPollIds = new Set(trendingPolls.map(p => p.id));

  const displayPolls = activeTab === 'active'
    ? activePolls.filter(poll => !trendingPollIds.has(poll.id))
    : completedPolls;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Decentralized Polling
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Create polls, vote, and earn with blockchain technology
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary whitespace-nowrap w-full sm:w-auto"
            >
              + Create Poll
            </button>
          </div>
        </div>

        {trendingPolls.length > 0 && activeTab === 'active' && (
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              Trending Polls
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {trendingPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  pollId={poll.id}
                  question={poll.question}
                  creator={poll.creator}
                  expiresAt={poll.expiresAt}
                  finalized={poll.finalized}
                  totalVotes={poll.totalVotes}
                  totalFunds={poll.totalFunds}
                  hasBet={poll.hasBet}
                  userAddress={userAddress}
                  onVoteSuccess={loadPolls}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Polls ({activePolls.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 md:px-6 py-3 font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed ({completedPolls.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading polls...</p>
          </div>
        ) : displayPolls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'active' ? 'No active polls yet' : 'No completed polls yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'active'
                ? 'Be the first to create a poll!'
                : 'Check back later for results'}
            </p>
            {activeTab === 'active' && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Create First Poll
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayPolls.map((poll) => (
              <PollCard
                key={poll.id}
                pollId={poll.id}
                question={poll.question}
                creator={poll.creator}
                expiresAt={poll.expiresAt}
                finalized={poll.finalized}
                totalVotes={poll.totalVotes}
                totalFunds={poll.totalFunds}
                hasBet={poll.hasBet}
                userAddress={userAddress}
                onVoteSuccess={loadPolls}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreatePollModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadPolls}
        />
      )}
    </div>
  );
}

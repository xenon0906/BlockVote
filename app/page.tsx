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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-block mb-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-purple-700">Live on Sepolia</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 mb-4 leading-tight">
              Vote. Bet. Win.
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-6">
              Create decentralized polls with optional betting. Transparent, immutable, and rewarding.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base md:text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Poll</span>
              </div>
            </button>
          </div>
        </div>

        {trendingPolls.length > 0 && activeTab === 'active' && (
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-2xl border border-orange-200 shadow-lg">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl md:text-2xl font-black text-orange-600">Trending Now</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 md:px-8 py-3 font-bold text-sm md:text-base rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active <span className="ml-2 opacity-75">({activePolls.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 md:px-8 py-3 font-bold text-sm md:text-base rounded-xl transition-all ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed <span className="ml-2 opacity-75">({completedPolls.length})</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading polls...</p>
          </div>
        ) : displayPolls.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📊</div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              {activeTab === 'active' ? 'No active polls yet' : 'No completed polls yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {activeTab === 'active'
                ? 'Be the first to create a poll and start the conversation!'
                : 'Completed polls will appear here'}
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Create First Poll
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

'use client';

import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { getActivePolls, getCompletedPolls, getPoll, getTotalPlatformVotes } from '@/utils/contract';

// Dynamic imports for better performance
const PollCard = dynamic(() => import('@/components/PollCard'), {
  loading: () => <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse h-64"></div>,
});

const CreatePollModal = dynamic(() => import('@/components/CreatePollModal'), {
  ssr: false,
});

interface Poll {
  id: number;
  question: string;
  creator: string;
  createdAt: bigint;
  expiresAt: bigint;
  finalized: boolean;
  finalizedAt?: bigint;
  totalVotes: bigint;
  totalFunds: bigint;
  hasBet: boolean;
  betOptionIndex?: number;
}

export default function Home() {
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [completedPolls, setCompletedPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [totalPlatformVotes, setTotalPlatformVotes] = useState<number>(0);
  const [displayedVotes, setDisplayedVotes] = useState<number>(0);

  useEffect(() => {
    loadPolls();
    checkWalletConnection();

    // Increase interval to 60 seconds for better performance
    const interval = setInterval(loadPolls, 60000);
    return () => clearInterval(interval);
  }, []);

  // Animate vote counter
  useEffect(() => {
    if (displayedVotes < totalPlatformVotes) {
      const increment = Math.ceil((totalPlatformVotes - displayedVotes) / 20);
      const timer = setTimeout(() => {
        setDisplayedVotes(prev => Math.min(prev + increment, totalPlatformVotes));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayedVotes, totalPlatformVotes]);

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

      const [activeIds, completedIds, totalVotes] = await Promise.all([
        getActivePolls(provider, 50),
        getCompletedPolls(provider, 20),
        getTotalPlatformVotes(provider),
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
      setTotalPlatformVotes(Number(totalVotes));
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

  const displayPolls = completedPolls.length === 0
    ? activePolls.filter(poll => !trendingPollIds.has(poll.id))
    : activeTab === 'active'
    ? activePolls.filter(poll => !trendingPollIds.has(poll.id))
    : completedPolls;

  const handleRefresh = useCallback(() => {
    setLoading(true);
    loadPolls();
  }, []);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'BlockVote',
            description: 'Decentralized blockchain polling platform on Ethereum',
            url: 'https://blockvoteapp.vercel.app',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: displayedVotes
            }
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <Header />

      {/* Hero Section - Optimized for all screen sizes */}
      <section className="h-[calc(100vh-4rem)] min-h-[600px] max-h-[1000px] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center h-full space-y-6 md:space-y-8">
            {/* Live Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full border border-purple-200 shadow-md">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-purple-700">Live on Sepolia</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 leading-tight px-4">
              Your Voice. Your Choice.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl lg:max-w-4xl px-4">
              Decentralized polling powered by blockchain. Every vote counts, every opinion matters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-2xl px-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="relative group w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Poll</span>
                </div>
              </button>
              <div className="flex items-center space-x-2 text-gray-700 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg border border-gray-200 w-full sm:w-auto justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-bold text-base sm:text-lg tabular-nums">{displayedVotes.toLocaleString()}</span>
                <span className="text-xs sm:text-sm">Total Votes</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-6xl px-4 pt-4">
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-all hover:shadow-2xl">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3">🗳️</div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1 md:mb-2">Vote Freely</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">Participate in polls that matter to you. Every vote is recorded on-chain.</p>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-all hover:shadow-2xl">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3">🔒</div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1 md:mb-2">Transparent</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">All votes are public and verifiable on the blockchain. No manipulation.</p>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-gray-200 text-center transform hover:scale-105 transition-all hover:shadow-2xl">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1 md:mb-2">Instant Results</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">See live results as votes come in. Real-time updates for every poll.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Polls Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-gray-200 hover:border-purple-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-5 h-5 text-purple-600 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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

        {completedPolls.length > 0 && (
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
        )}

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
    </>
  );
}

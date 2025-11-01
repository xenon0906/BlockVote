'use client'

import { useState, useEffect, useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import { useMultiplePollsData } from '@/lib/hooks/usePollData'
import Header from '@/components/Header'
import StatusBar from '@/components/StatusBar'
import PollCard from '@/components/PollCard'
import CreatePollModal from '@/components/CreatePollModal'
import { Plus, TrendingUp, Loader2 } from 'lucide-react'

interface Poll {
  id: bigint
  title: string
  description: string
  creator: string
  endTime: bigint
  totalVotes: bigint
  totalInteractions: bigint
  votingFee: bigint
  isActive: boolean
  winner?: string
  totalRewardPool?: bigint
}

export default function Home() {
  const { isConnected } = useAccount()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch trending poll IDs
  const { data: trendingIds, isLoading: loadingTrending, refetch: refetchTrending } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getTrendingPolls',
    query: {
      refetchInterval: 15000, // Refetch every 15 seconds
      staleTime: 10000,
    },
  })

  // Fetch active poll IDs
  const { data: activeIds, isLoading: loadingActive, refetch: refetchActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getActivePolls',
    query: {
      refetchInterval: 15000, // Refetch every 15 seconds
      staleTime: 10000,
    },
  })

  // Memoize filtered IDs to prevent unnecessary re-renders
  const trendingIdsFiltered = useMemo(() =>
    ((trendingIds as bigint[]) || []).filter(id => id > 0n),
    [trendingIds]
  )

  const activeIdsFiltered = useMemo(() =>
    ((activeIds as bigint[]) || []).filter(id => id > 0n),
    [activeIds]
  )

  const { polls: trendingPolls, isLoading: loadingTrendingPolls } = useMultiplePollsData(trendingIdsFiltered)
  const { polls: activePolls, isLoading: loadingActivePolls } = useMultiplePollsData(activeIdsFiltered)

  const handleRefresh = () => {
    refetchTrending()
    refetchActive()
  }

  const hasTrendingPolls = trendingPolls.length > 0
  const hasActivePolls = activePolls.length > 0
  const isLoading = loadingTrending || loadingActive || loadingTrendingPolls || loadingActivePolls

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Decentralized Voting
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Create polls, vote transparently, and earn rewards on Sepolia testnet
          </p>

          {mounted && (
            <>
              {isConnected ? (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl transition-all font-semibold flex items-center space-x-2 mx-auto group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Create New Poll</span>
                </button>
              ) : (
                <div className="glass-effect rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-gray-300 mb-4">Connect your wallet to create polls and vote</p>
                  <p className="text-sm text-gray-400">
                    Make sure you have Sepolia ETH in your wallet
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Trending Polls Section - Only show if there are trending polls */}
            {hasTrendingPolls && (
              <div className="mb-12 animate-fade-in">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold">Trending Polls</h2>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                    {trendingPolls.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingPolls.map((poll, index) => (
                    <PollCard
                      key={`trending-${poll.id.toString()}`}
                      poll={poll}
                      type="trending"
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Polls Section */}
            {hasActivePolls && (
              <div className={hasTrendingPolls ? 'mt-12 animate-fade-in' : 'animate-fade-in'}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-50" />
                    <div className="relative w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {hasTrendingPolls ? 'More Active Polls' : 'Active Polls'}
                  </h2>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    {activePolls.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePolls.map((poll) => (
                    <PollCard
                      key={`active-${poll.id.toString()}`}
                      poll={poll}
                      type="active"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Polls Message */}
            {!hasTrendingPolls && !hasActivePolls && (
              <div className="glass-effect rounded-xl p-12 text-center animate-fade-in">
                <Plus className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
                <p className="text-gray-400 text-lg mb-2">No active polls yet</p>
                <p className="text-gray-500 text-sm">
                  {isConnected
                    ? 'Be the first to create a poll!'
                    : 'Connect your wallet to create a poll'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Poll Modal */}
      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  )
}

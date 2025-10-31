'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import { useMultiplePollsData } from '@/lib/hooks/usePollData'
import Header from '@/components/Header'
import StatusBar from '@/components/StatusBar'
import PollCard from '@/components/PollCard'
import CreatePollModal from '@/components/CreatePollModal'
import { Plus, TrendingUp, Activity, CheckCircle, Loader2 } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'trending' | 'active' | 'completed'>('trending')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch trending poll IDs
  const { data: trendingIds, isLoading: loadingTrending, refetch: refetchTrending } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getTrendingPolls',
  })

  // Fetch active poll IDs
  const { data: activeIds, isLoading: loadingActive, refetch: refetchActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getActivePolls',
  })

  // Fetch completed poll IDs
  const { data: completedIds, isLoading: loadingCompleted, refetch: refetchCompleted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getCompletedPolls',
  })

  // Fetch poll data using the hook
  const trendingIdsFiltered = ((trendingIds as bigint[]) || []).filter(id => id > 0)
  const activeIdsFiltered = ((activeIds as bigint[]) || []).filter(id => id > 0)
  const completedIdsFiltered = ((completedIds as bigint[]) || []).filter(id => id > 0)

  const { polls: trendingPolls, isLoading: loadingTrendingPolls } = useMultiplePollsData(trendingIdsFiltered)
  const { polls: activePolls, isLoading: loadingActivePolls } = useMultiplePollsData(activeIdsFiltered)
  const { polls: completedPolls, isLoading: loadingCompletedPolls } = useMultiplePollsData(completedIdsFiltered)

  const handleRefresh = () => {
    refetchTrending()
    refetchActive()
    refetchCompleted()
  }

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp, count: trendingPolls.length },
    { id: 'active', label: 'Active', icon: Activity, count: activePolls.length },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: completedPolls.length },
  ]

  const getCurrentPolls = () => {
    switch (activeTab) {
      case 'trending':
        return trendingPolls
      case 'active':
        return activePolls
      case 'completed':
        return completedPolls
      default:
        return []
    }
  }

  const isLoading = loadingTrending || loadingActive || loadingCompleted || loadingTrendingPolls || loadingActivePolls || loadingCompletedPolls

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

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'glass-effect hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Polls Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : getCurrentPolls().length === 0 ? (
          <div className="glass-effect rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">No {activeTab} polls found</p>
            <p className="text-gray-500 text-sm mt-2">
              {activeTab === 'trending' && 'Polls with the most interactions will appear here'}
              {activeTab === 'active' && 'Create a new poll to get started'}
              {activeTab === 'completed' && 'Completed polls from the last 24 hours will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentPolls().map((poll, index) => (
              <PollCard
                key={poll.id.toString()}
                poll={poll}
                type={activeTab}
                rank={activeTab === 'trending' ? index + 1 : undefined}
              />
            ))}
          </div>
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

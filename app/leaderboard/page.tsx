'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import Header from '@/components/Header'
import { Trophy, Award, Medal, TrendingUp, Vote, Loader2 } from 'lucide-react'
import { formatEther } from 'viem'

interface LeaderboardEntry {
  address: string
  totalVotes: number
  totalRewards: bigint
  rank: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: pollCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'pollCount',
  })

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!pollCount) return

      const userStats = new Map<string, { votes: number; rewards: bigint }>()

      // Fetch all polls and their winners
      for (let i = 0; i < Number(pollCount); i++) {
        try {
          // This is a simplified version - in production, you'd want to use events or a subgraph
          const response = await fetch(`/api/leaderboard`)
          if (response.ok) {
            const data = await response.json()
            setLeaderboard(data)
            break
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error)
        }
      }

      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [pollCount])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-300" />
      case 3:
        return <Medal className="w-8 h-8 text-orange-400" />
      default:
        return <Award className="w-6 h-6 text-gray-500" />
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-orange-400/20 to-orange-600/20 border-orange-400/30'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-400">
            Top voters and winners across all polls
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Most Active</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {leaderboard[0]?.totalVotes || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">votes by top user</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold">Total Winners</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {leaderboard.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">unique winners</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Vote className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">Total Rewards</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {leaderboard[0]?.totalRewards
                ? formatEther(leaderboard[0].totalRewards)
                : '0'} ETH
            </p>
            <p className="text-sm text-gray-400 mt-1">distributed to winners</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="glass-effect rounded-xl p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No leaderboard data yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start voting and winning polls to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.address}
                className={`${getRankBg(entry.rank)} border rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and Address */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg font-bold">#{entry.rank}</span>
                        <span className="font-mono text-sm text-gray-400 truncate max-w-[300px]">
                          {entry.address}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Vote className="w-4 h-4" />
                          <span>{entry.totalVotes} votes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{formatEther(entry.totalRewards)} ETH rewards</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">How Rankings Work</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Rankings are based on total votes cast and rewards won across all polls</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Winners receive 90% of the total voting fees as rewards</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>The more you participate and win, the higher you climb on the leaderboard</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>All transactions are transparent and verifiable on the Sepolia blockchain</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

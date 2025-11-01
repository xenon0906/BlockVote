'use client'

import { memo } from 'react'
import { Clock, Users, TrendingUp, Award } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatEther } from 'viem'
import Link from 'next/link'

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

interface PollCardProps {
  poll: Poll
  type: 'trending' | 'active' | 'completed'
  rank?: number
}

function PollCard({ poll, type, rank }: PollCardProps) {
  const endTime = new Date(Number(poll.endTime) * 1000)
  const timeRemaining = poll.isActive ? formatDistanceToNow(endTime, { addSuffix: true }) : 'Ended'

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('PollCard Render:', {
      pollId: poll.id.toString(),
      title: poll.title,
      linkHref: `/poll/${poll.id.toString()}`
    })
  }

  const getBadgeColor = () => {
    switch (type) {
      case 'trending':
        return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      case 'completed':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBadgeText = () => {
    if (type === 'trending' && rank) return `#${rank} Trending`
    if (type === 'active') return 'Active'
    if (type === 'completed') return 'Completed'
    return ''
  }

  return (
    <Link href={`/poll/${poll.id.toString()}`} className="block">
      <div className="glass-effect rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`${getBadgeColor()} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {getBadgeText()}
            </span>
            {type === 'completed' && poll.winner && (
              <Award className="w-5 h-5 text-yellow-400" />
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {poll.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{poll.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">{Number(poll.totalVotes)} votes</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{Number(poll.totalInteractions)} interactions</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{timeRemaining}</span>
            </div>
            <div className="text-sm font-semibold text-primary">
              {formatEther(poll.votingFee)} ETH/vote
            </div>
          </div>

          {/* Winner info for completed polls */}
          {type === 'completed' && poll.winner && poll.totalRewardPool && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-xs text-gray-400 mb-1">Winner</p>
              <p className="text-sm font-mono text-yellow-400 truncate">{poll.winner}</p>
              <p className="text-xs text-gray-400 mt-1">
                Prize: {formatEther(poll.totalRewardPool * BigInt(90) / BigInt(100))} ETH
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default memo(PollCard)

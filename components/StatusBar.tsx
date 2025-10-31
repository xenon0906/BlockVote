'use client'

import { useEffect, useState, memo } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import { Activity, Users, CheckCircle, TrendingUp } from 'lucide-react'

function StatusBar() {
  const [stats, setStats] = useState({
    totalPolls: 0,
    activePolls: 0,
    completedPolls: 0,
    totalVotes: 0,
  })

  const [displayStats, setDisplayStats] = useState({
    totalPolls: 0,
    activePolls: 0,
    completedPolls: 0,
    totalVotes: 0,
  })

  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getTotalStats',
  })

  useEffect(() => {
    if (data) {
      const [totalPolls, activePolls, completedPolls, totalVotes] = data as [bigint, bigint, bigint, bigint]
      setStats({
        totalPolls: Number(totalPolls),
        activePolls: Number(activePolls),
        completedPolls: Number(completedPolls),
        totalVotes: Number(totalVotes),
      })
    }
  }, [data])

  // Animate numbers
  useEffect(() => {
    const duration = 1500 // Animation duration in ms
    const steps = 60 // Number of animation steps
    const stepDuration = duration / steps

    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setDisplayStats({
        totalPolls: Math.floor(stats.totalPolls * progress),
        activePolls: Math.floor(stats.activePolls * progress),
        completedPolls: Math.floor(stats.completedPolls * progress),
        totalVotes: Math.floor(stats.totalVotes * progress),
      })

      if (currentStep >= steps) {
        setDisplayStats(stats)
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [stats])

  const statItems = [
    { icon: Activity, label: 'Total Polls', value: displayStats.totalPolls, color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Active Polls', value: displayStats.activePolls, color: 'text-green-400' },
    { icon: CheckCircle, label: 'Completed', value: displayStats.completedPolls, color: 'text-purple-400' },
    { icon: Users, label: 'Total Votes', value: displayStats.totalVotes, color: 'text-pink-400' },
  ]

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-6 mb-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-effect rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">{item.label}</p>
                <p className="text-2xl font-bold tabular-nums">{item.value.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(StatusBar)

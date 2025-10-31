'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import { X, Plus, Loader2 } from 'lucide-react'

interface CreatePollModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatePollModal({ isOpen, onClose, onSuccess }: CreatePollModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '7',
    maxCandidates: '5',
    votingFee: '0.001',
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: 'createPoll',
        args: [
          formData.title,
          formData.description,
          BigInt(formData.duration),
          BigInt(formData.maxCandidates),
          parseEther(formData.votingFee),
        ],
      })
    } catch (error) {
      console.error('Error creating poll:', error)
    }
  }

  if (isSuccess) {
    setTimeout(() => {
      onSuccess?.()
      onClose()
      setFormData({
        title: '',
        description: '',
        duration: '7',
        maxCandidates: '5',
        votingFee: '0.001',
      })
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-effect rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Create New Poll</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isPending || isConfirming}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poll Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Best Programming Language 2024"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Describe what this poll is about..."
              required
            />
          </div>

          {/* Duration and Max Candidates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (days) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Candidates <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxCandidates}
                onChange={(e) => setFormData({ ...formData, maxCandidates: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Voting Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voting Fee (ETH) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.votingFee}
              onChange={(e) => setFormData({ ...formData, votingFee: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.001"
              required
            />
            <p className="text-xs text-gray-400 mt-2">
              Fee that each voter must pay. Winner receives 90% of total fees collected.
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              After creating the poll, candidates can register to participate. Voters pay the voting fee,
              and the winner receives 90% of the total collected fees as a reward!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium"
              disabled={isPending || isConfirming}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isPending ? 'Creating...' : 'Confirming...'}
                </>
              ) : isSuccess ? (
                'Success!'
              ) : (
                'Create Poll'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

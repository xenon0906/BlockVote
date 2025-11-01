'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'
import { formatEther, parseEther } from 'viem'
import { formatDistanceToNow, format } from 'date-fns'
import Header from '@/components/Header'
import {
  Clock,
  Users,
  TrendingUp,
  Vote as VoteIcon,
  UserPlus,
  Trash2,
  Award,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react'

interface Candidate {
  candidateAddress: string
  name: string
  voteCount: bigint
  exists: boolean
}

interface Poll {
  id: bigint
  title: string
  description: string
  creator: string
  createdAt: bigint
  endTime: bigint
  maxCandidates: bigint
  votingFee: bigint
  totalVotes: bigint
  totalInteractions: bigint
  candidateCount: bigint
  isActive: boolean
  isDeleted: boolean
  winner: string
  totalRewardPool: bigint
}

export default function PollDetail() {
  const params = useParams()
  const router = useRouter()
  const { address } = useAccount()
  const pollId = params.id as string

  const [poll, setPoll] = useState<Poll | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [candidateName, setCandidateName] = useState('')
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)
  const [replacePayment, setReplacePayment] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Read poll data
  const { data: pollData, refetch: refetchPoll, isLoading: isPollLoading, isError: isPollError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getPoll',
    args: pollId ? [BigInt(pollId)] : undefined,
  })

  // Read candidates
  const { data: candidatesData, refetch: refetchCandidates } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getAllCandidates',
    args: pollId ? [BigInt(pollId)] : undefined,
  })

  // Check if user has voted
  const { data: hasVoted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'hasVoted',
    args: pollId && address ? [BigInt(pollId), address as `0x${string}`] : undefined,
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (pollData) {
      setPoll(pollData as Poll)
    }
  }, [pollData])

  useEffect(() => {
    if (candidatesData) {
      setCandidates(candidatesData as Candidate[])
    }
  }, [candidatesData])

  useEffect(() => {
    if (isSuccess) {
      if (isDeleting) {
        // Redirect to homepage after successful deletion
        router.push('/')
        return
      }
      refetchPoll()
      refetchCandidates()
      setCandidateName('')
      setShowAddCandidate(false)
      setReplaceIndex(null)
      setReplacePayment('')
    }
  }, [isSuccess, isDeleting, router, refetchPoll, refetchCandidates])

  const handleAddCandidate = () => {
    if (!candidateName) return

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'addCandidate',
      args: [BigInt(pollId), candidateName],
    })
  }

  const handleReplaceCandidate = (index: number) => {
    if (!candidateName || !replacePayment) return

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'replaceCandidate',
      args: [BigInt(pollId), BigInt(index), candidateName],
      value: parseEther(replacePayment),
    })
  }

  const handleVote = (candidateIndex: number) => {
    if (!poll) return

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'vote',
      args: [BigInt(pollId), BigInt(candidateIndex)],
      value: poll.votingFee,
    })
  }

  const handleEndPoll = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'endPoll',
      args: [BigInt(pollId)],
    })
  }

  const handleDeletePoll = () => {
    if (confirm('Are you sure you want to delete this poll? All voters will be refunded.')) {
      setIsDeleting(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: 'deletePoll',
        args: [BigInt(pollId)],
      })
    }
  }

  const handleClaimRefund = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'claimRefund',
      args: [BigInt(pollId)],
    })
  }

  // Loading state
  if (isPollLoading || !pollData) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-gray-400">Loading poll data...</p>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (isPollError || !poll) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pt-24">
          <div className="glass-effect rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-2">Poll Not Found</h2>
            <p className="text-gray-400 mb-6">
              This poll doesn&apos;t exist or has been deleted.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  const isEnded = Number(poll.endTime) * 1000 < Date.now()
  const isUserAlreadyCandidate = address ? candidates.some(
    (candidate) => candidate.candidateAddress.toLowerCase() === address.toLowerCase()
  ) : false
  const canAddCandidate =
    Boolean(address) &&
    poll.isActive &&
    !isEnded &&
    !isUserAlreadyCandidate &&
    Number(poll.candidateCount) < Number(poll.maxCandidates)
  const isCreator = address ? address.toLowerCase() === poll.creator.toLowerCase() : false

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Poll Debug:', {
      pollId,
      address,
      isActive: poll.isActive,
      isEnded,
      candidateCount: Number(poll.candidateCount),
      maxCandidates: Number(poll.maxCandidates),
      isUserAlreadyCandidate,
      canAddCandidate,
      candidatesLength: candidates.length
    })
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Polls</span>
        </button>

        {/* Connection Status Banner */}
        {!address && poll.isActive && !isEnded && (
          <div className="glass-effect rounded-2xl p-6 mb-6 border-2 border-yellow-500/50 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">⚠️ Wallet Not Connected</h3>
                <p className="text-gray-300">Connect your wallet to register as a candidate or vote</p>
              </div>
              <div className="text-sm text-gray-400">
                Click &quot;Connect Wallet&quot; button in the header →
              </div>
            </div>
          </div>
        )}

        {/* Poll Header */}
        <div className="glass-effect rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{poll.title}</h1>
              <p className="text-gray-400 text-lg">{poll.description}</p>
            </div>

            {isCreator && poll.isActive && !isEnded && (
              <button
                onClick={handleDeletePoll}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center space-x-2"
                disabled={isPending || isConfirming}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Poll Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">
                  {isEnded ? 'Ended' : 'Ends'}
                </p>
                <p className="font-semibold text-sm">
                  {isEnded
                    ? format(new Date(Number(poll.endTime) * 1000), 'PPp')
                    : formatDistanceToNow(new Date(Number(poll.endTime) * 1000), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Total Votes</p>
                <p className="font-semibold">{Number(poll.totalVotes)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Interactions</p>
                <p className="font-semibold">{Number(poll.totalInteractions)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">Prize Pool</p>
                <p className="font-semibold">{formatEther(poll.totalRewardPool)} ETH</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {poll.isDeleted && hasVoted && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-semibold">This poll has been deleted</p>
                <button
                  onClick={handleClaimRefund}
                  className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  disabled={isPending || isConfirming}
                >
                  Claim Refund
                </button>
              </div>
            </div>
          )}

          {isEnded && poll.isActive && isCreator && (
            <button
              onClick={handleEndPoll}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all font-semibold"
              disabled={isPending || isConfirming}
            >
              End Poll & Distribute Rewards
            </button>
          )}
        </div>

        {/* Register as Candidate Section - Always visible when eligible */}
        {canAddCandidate && poll.isActive && !isEnded && (
          <div className="glass-effect rounded-2xl p-6 mb-6 border-2 border-primary/50 animate-fade-in">
            <h3 className="text-xl font-bold text-primary mb-4">✨ Register as a Candidate</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your name (e.g., John Doe)"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
              <button
                onClick={handleAddCandidate}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!candidateName || isPending || isConfirming}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isPending ? 'Waiting for approval...' : 'Confirming transaction...'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Register as Candidate
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 text-center">
                Free to register • You&apos;ll compete for votes in this poll
              </p>
            </div>
          </div>
        )}

        {/* Already Candidate Banner */}
        {address && isUserAlreadyCandidate && poll.isActive && !isEnded && (
          <div className="glass-effect rounded-2xl p-6 mb-6 border-2 border-green-500/50 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-400">You&apos;re a Candidate!</h3>
                <p className="text-gray-300">You&apos;re registered in this poll. Good luck!</p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Section */}
        <div className="glass-effect rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Candidates ({Number(poll.candidateCount)}/{Number(poll.maxCandidates)})
            </h2>
          </div>

          {/* Candidates List */}
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No candidates yet. Be the first to register!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate, index) => {
                const percentage = poll.totalVotes > 0
                  ? (Number(candidate.voteCount) / Number(poll.totalVotes)) * 100
                  : 0

                return (
                  <div
                    key={index}
                    className={`p-5 bg-white/5 hover:bg-white/10 rounded-xl transition-all ${
                      poll.winner?.toLowerCase() === candidate.candidateAddress.toLowerCase()
                        ? 'ring-2 ring-yellow-400'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        {poll.winner?.toLowerCase() === candidate.candidateAddress.toLowerCase() && (
                          <Award className="w-6 h-6 text-yellow-400" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{candidate.name}</p>
                          <p className="text-sm text-gray-400 font-mono truncate">
                            {candidate.candidateAddress}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">{Number(candidate.voteCount)}</p>
                        <p className="text-sm text-gray-400">votes</p>
                      </div>
                    </div>

                    {/* Vote Progress Bar */}
                    <div className="mb-3">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}%</p>
                    </div>

                    {/* Action Buttons */}
                    {poll.isActive && !isEnded && !poll.isDeleted && (
                      <div className="flex space-x-2">
                        {!address ? (
                          <div className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg text-center">
                            Connect wallet to vote
                          </div>
                        ) : !hasVoted ? (
                          <>
                            <button
                              onClick={() => handleVote(index)}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all flex items-center justify-center space-x-2"
                              disabled={isPending || isConfirming}
                            >
                              <VoteIcon className="w-4 h-4" />
                              <span>Vote ({formatEther(poll.votingFee)} ETH)</span>
                            </button>

                            {Number(poll.candidateCount) >= Number(poll.maxCandidates) && (
                              <button
                                onClick={() => setReplaceIndex(index)}
                                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors"
                              >
                                Replace
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-center">
                            You&apos;ve already voted
                          </div>
                        )}
                      </div>
                    )}

                    {/* Replace Form */}
                    {replaceIndex === index && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg space-y-2">
                        <input
                          type="text"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="Your candidate name"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <input
                          type="text"
                          value={replacePayment}
                          onChange={(e) => setReplacePayment(e.target.value)}
                          placeholder="Payment amount (ETH)"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReplaceCandidate(index)}
                            className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-sm"
                            disabled={!candidateName || !replacePayment || isPending || isConfirming}
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => {
                              setReplaceIndex(null)
                              setCandidateName('')
                              setReplacePayment('')
                            }}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 glass-effect rounded-xl p-6">
          <h3 className="font-semibold mb-3">Poll Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <span className="text-gray-500">Creator:</span>
              <span className="ml-2 font-mono">{poll.creator}</span>
            </div>
            <div>
              <span className="text-gray-500">Voting Fee:</span>
              <span className="ml-2 font-semibold">{formatEther(poll.votingFee)} ETH</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2">{format(new Date(Number(poll.createdAt) * 1000), 'PPp')}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Candidates:</span>
              <span className="ml-2">{Number(poll.maxCandidates)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

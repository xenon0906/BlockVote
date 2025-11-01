import { useState, useEffect, useMemo, useCallback } from 'react'
import { useReadContract, usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/lib/config'
import { VOTING_CONTRACT_ABI } from '@/lib/contract-abi'

export function usePollData(pollId: bigint) {
  const { data: pollData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getPoll',
    args: [pollId],
    query: {
      staleTime: 10000,
    },
  })

  return { data: pollData, refetch }
}

export function useMultiplePollsData(pollIds: bigint[]) {
  const [polls, setPolls] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const publicClient = usePublicClient()

  // Create stable reference for pollIds to prevent unnecessary re-fetches
  const pollIdsString = useMemo(() => {
    return pollIds.map(id => id.toString()).sort().join(',')
  }, [pollIds])

  const fetchPolls = useCallback(async () => {
    if (!publicClient || pollIds.length === 0) {
      setPolls([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      // Fetch all polls in parallel
      const pollPromises = pollIds.map(async (id) => {
        try {
          const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: VOTING_CONTRACT_ABI,
            functionName: 'getPoll',
            args: [id],
          })
          return data
        } catch (error) {
          console.error(`Error fetching poll ${id}:`, error)
          return null
        }
      })

      const results = await Promise.all(pollPromises)
      const validPolls = results.filter(poll => poll !== null)

      // Update state directly without comparison to avoid BigInt serialization
      setPolls(validPolls)
    } catch (error) {
      console.error('Error fetching polls:', error)
      setPolls([])
    } finally {
      setIsLoading(false)
    }
  }, [pollIdsString, publicClient, pollIds])

  useEffect(() => {
    fetchPolls()
  }, [fetchPolls])

  return { polls, isLoading }
}

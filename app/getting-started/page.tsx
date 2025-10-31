'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowLeft, Wallet, Plus, Vote, Award, CheckCircle } from 'lucide-react'

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Getting Started
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start creating and participating in decentralized polls in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="glass-effect rounded-2xl p-8 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Step 1: Connect Your Wallet</h2>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">Required</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Click the &quot;Connect Wallet&quot; button in the top right corner to connect your Ethereum wallet. BlockVote supports MetaMask, WalletConnect, and Coinbase Wallet.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-gray-300 font-medium mb-2">What you&apos;ll need:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li>A wallet installed (e.g., MetaMask browser extension)</li>
                    <li>Some Sepolia ETH for gas fees (free from faucets)</li>
                    <li>Connected to the Sepolia test network</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-effect rounded-2xl p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Step 2: Create a Poll</h2>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">Creator</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Click &quot;Create Poll&quot; to start a new voting poll. Fill in the details and set your parameters.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-gray-300 font-medium mb-2">Poll Configuration:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li><strong>Title & Description:</strong> Make it clear and concise</li>
                    <li><strong>Duration:</strong> How long the poll will be active</li>
                    <li><strong>Max Candidates:</strong> Maximum number of options (2-10)</li>
                    <li><strong>Voting Fee:</strong> Optional fee per vote (creates reward pool)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-effect rounded-2xl p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Step 3: Add Candidates</h2>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-sm rounded-full">Anyone</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Anyone can add candidates to an active poll. You can also replace existing candidates by paying their previous vote count.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-gray-300 font-medium mb-2">Candidate System:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li>Free to add until max candidates reached</li>
                    <li>Replace candidates by paying equivalent to their votes</li>
                    <li>Competitive system ensures quality options</li>
                    <li>Replaced candidates are automatically removed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-effect rounded-2xl p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Step 4: Cast Your Vote</h2>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">Voter</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Browse active polls and cast your vote by paying the voting fee. Each address can vote once per poll.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-gray-300 font-medium mb-2">Voting Rules:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li>One vote per wallet address per poll</li>
                    <li>Pay the voting fee to cast your vote</li>
                    <li>Votes are recorded on blockchain (immutable)</li>
                    <li>Can claim refund if poll is deleted</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="glass-effect rounded-2xl p-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Step 5: Claim Rewards</h2>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">Winner</span>
                </div>
                <p className="text-gray-400 mb-4">
                  When a poll ends, the winning candidate receives 90% of the total reward pool. The platform keeps 10% for maintenance.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-gray-300 font-medium mb-2">Reward Distribution:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li><strong>Winner:</strong> 90% of total voting fees collected</li>
                    <li><strong>Platform:</strong> 10% for system maintenance</li>
                    <li>Rewards sent automatically when poll ends</li>
                    <li>Check leaderboard to see top performers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-12 glass-effect rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">
            Join thousands of users creating and participating in transparent, blockchain-based polls
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Browse Polls
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

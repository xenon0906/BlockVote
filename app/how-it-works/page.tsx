'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowLeft, Shield, Zap, Trophy, Users, Lock, Coins, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function HowItWorks() {
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            How It Works
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Decentralized voting powered by Ethereum smart contracts. Transparent, secure, and unstoppable.
          </p>
        </div>

        {/* Core Features */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="glass-effect rounded-2xl p-6 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Blockchain Security</h3>
            <p className="text-gray-400 text-sm">
              All votes are recorded on Ethereum blockchain, making them permanent and tamper-proof
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-gray-400 text-sm">
              Real-time vote counting with transparent results visible to everyone
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Winner Rewards</h3>
            <p className="text-gray-400 text-sm">
              Winning candidates receive 90% of the voting fees collected automatically
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Open Participation</h3>
            <p className="text-gray-400 text-sm">
              Anyone can create polls, add candidates, and vote without permission
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">One Vote Per Wallet</h3>
            <p className="text-gray-400 text-sm">
              Each wallet address can vote only once per poll, ensuring fairness
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Refund Protection</h3>
            <p className="text-gray-400 text-sm">
              If a poll is deleted, all voters automatically get their voting fees refunded
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold">Competitive Candidate System</h2>
            </div>
            <p className="text-gray-400 mb-4">
              BlockVote uses a unique competitive system where anyone can add candidates, but once the maximum is reached, new candidates can replace existing ones by paying an amount equivalent to their current vote count.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">How Replacement Works:</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Poll creator sets maximum number of candidates (2-10)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>First candidates are added for free until maximum reached</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>After that, pay the candidate's vote value to replace them</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Payment goes to the reward pool, increasing winner's prize</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Ensures only quality candidates remain in the poll</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Coins className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold">Reward Distribution</h2>
            </div>
            <p className="text-gray-400 mb-4">
              All voting fees are collected into a reward pool. When the poll ends, rewards are distributed automatically through smart contracts.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                <div className="text-4xl font-bold text-green-400 mb-2">90%</div>
                <p className="text-white font-semibold mb-1">Winning Candidate</p>
                <p className="text-sm text-gray-400">
                  The candidate with the most votes receives 90% of the total reward pool
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <div className="text-4xl font-bold text-blue-400 mb-2">10%</div>
                <p className="text-white font-semibold mb-1">Platform Fee</p>
                <p className="text-sm text-gray-400">
                  Platform keeps 10% to maintain the system and smart contracts
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold">Smart Contract Security</h2>
            </div>
            <p className="text-gray-400 mb-4">
              BlockVote is powered by audited Solidity smart contracts deployed on Ethereum Sepolia testnet.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Immutable Voting Records</p>
                  <p className="text-sm text-gray-400">Once a vote is cast, it cannot be changed or deleted by anyone</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Transparent Execution</p>
                  <p className="text-sm text-gray-400">All transactions are public on the blockchain explorer</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Automated Rewards</p>
                  <p className="text-sm text-gray-400">Smart contracts automatically distribute rewards when polls end</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Refund Safety</p>
                  <p className="text-sm text-gray-400">If a poll is deleted, voters can claim full refunds instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Is BlockVote free to use?</h3>
              <p className="text-gray-400 text-sm">
                Creating polls and adding candidates is free. Voting requires paying the poll's voting fee (set by creator), which goes into the reward pool for the winner.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Which blockchain does BlockVote use?</h3>
              <p className="text-gray-400 text-sm">
                BlockVote is deployed on Ethereum Sepolia testnet. This is a test network where you can get free ETH from faucets to try the platform without real money.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Can votes be changed after casting?</h3>
              <p className="text-gray-400 text-sm">
                No. Once a vote is recorded on the blockchain, it is permanent and cannot be changed by anyone, including the platform operators.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">What happens if a poll is deleted?</h3>
              <p className="text-gray-400 text-sm">
                If the poll creator deletes a poll, all voting fees are held in the contract. Voters can claim their refunds at any time using the "Claim Refund" button.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Decentralized Voting?</h2>
          <p className="text-gray-400 mb-6">
            Join the future of transparent, secure voting on the blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/getting-started"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
            >
              Browse Polls
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

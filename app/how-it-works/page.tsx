'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base group transition-all">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Polls
          </Link>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 md:mb-5">
            How BlockVote Works
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A decentralized polling platform powered by blockchain technology. Every vote is transparent, verifiable, and immutable. Welcome to the future of democratic decision-making.
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          {/* The Voting Process */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">
              📋 The Voting Process
            </h2>

            <div className="space-y-6 md:space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">1</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    Link your MetaMask wallet to the Sepolia testnet. The platform automatically detects your wallet and handles network switching for you.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4 md:p-5">
                    <p className="text-sm md:text-base text-blue-900">
                      <strong>📱 Mobile users:</strong> If MetaMask isn't detected, you'll be automatically redirected to open BlockVote in the MetaMask app browser for seamless mobile voting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">2</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Create a Poll</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    Design your poll with a compelling question and 2-6 answer options. Set the duration (1 hour to 30 days) and optionally place a bet on the outcome to win 90% of the voting pool if you predict correctly.
                  </p>
                  <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <p className="text-sm md:text-base font-semibold text-gray-900 mb-3">💰 Creation Costs:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base">
                      <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Platform fee:</span>
                        <span className="font-mono font-bold text-purple-700">0.005 ETH</span>
                      </div>
                      <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Optional bet:</span>
                        <span className="font-mono font-bold text-blue-700">+0.001 ETH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">3</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-yellow-100 hover:border-yellow-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Place Your Bet (Optional)</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    When creating a poll with a bet, select which option you believe will win. Your prediction is encrypted and hidden from other voters - they only see live vote percentages, not your bet.
                  </p>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 md:p-5">
                    <p className="text-sm md:text-base text-yellow-900">
                      <strong>🔒 Privacy Protected:</strong> Your bet choice remains completely hidden until the poll is finalized. Other voters see percentages but not which option you backed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">4</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-green-100 hover:border-green-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Community Votes</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    Anyone can participate by connecting their wallet and voting for 0.001 ETH per vote. Each wallet address can only vote once per poll, ensuring fair representation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="text-2xl mb-2">⛓️</div>
                      <p className="text-sm md:text-base font-semibold text-green-900">On-Chain Recording</p>
                      <p className="text-xs md:text-sm text-green-700 mt-1">Every vote is permanently recorded on the blockchain</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm md:text-base font-semibold text-blue-900">Real-Time Results</p>
                      <p className="text-xs md:text-sm text-blue-700 mt-1">Watch vote percentages update instantly as people vote</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">5</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-pink-100 hover:border-pink-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Poll Closes & Results</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    When the countdown reaches zero, anyone can trigger finalization. The smart contract automatically tallies all votes and determines the winning option with complete transparency.
                  </p>
                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                    <p className="text-sm md:text-base text-pink-900">
                      <strong>🏆 Winner Determined:</strong> The option with the most votes wins. Ties are broken by which option reached the vote count first (on-chain timestamp).
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl font-black">6</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Automatic Payouts</h3>
                  <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                    If the poll creator bet correctly, they receive 90% of all voting funds automatically. If wrong (or didn't bet), all funds go to the platform wallet for maintenance and development.
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 md:p-6">
                    <p className="text-sm md:text-base font-semibold text-green-900 mb-3">💡 Example Payout:</p>
                    <div className="space-y-2 text-sm md:text-base text-green-800">
                      <p>📊 Poll receives <strong>50 votes</strong> = <strong>0.050 ETH</strong> collected</p>
                      <p>✅ Creator bet correctly → Receives <strong>0.045 ETH</strong> (90%)</p>
                      <p>🏢 Platform fee → <strong>0.005 ETH</strong> (10%)</p>
                      <p className="text-xs md:text-sm text-green-700 mt-3 pt-3 border-t border-green-200">
                        The 10% platform fee helps maintain the infrastructure, pay for gas fees, and support ongoing development.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Blockchain Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">
              🔗 Why Blockchain Technology?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200 hover:border-purple-300 transition-all">
                <div className="text-4xl md:text-5xl mb-4">🔒</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Immutable & Permanent</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Once a vote is cast on the blockchain, it becomes part of an unchangeable permanent record. No one - not even the poll creator, platform admins, or hackers - can alter, delete, or manipulate votes after they're submitted. This guarantees the integrity of every poll.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                <div className="text-4xl md:text-5xl mb-4">👁️</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Fully Transparent</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Every transaction is publicly visible on Sepolia Etherscan. Anyone can independently verify poll results, vote counts, and fund distributions. No hidden algorithms or black boxes - just pure, verifiable truth that anyone can audit at any time.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200 hover:border-green-300 transition-all">
                <div className="text-4xl md:text-5xl mb-4">⚡</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Automated & Trustless</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Smart contracts handle vote counting, result determination, and fund distribution automatically without human intervention. No trusted third party needed - the code is law. When conditions are met, payouts happen instantly and exactly as programmed.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200 hover:border-pink-300 transition-all">
                <div className="text-4xl md:text-5xl mb-4">🌍</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Globally Accessible</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Anyone with MetaMask can participate from anywhere in the world, 24/7. No geographic restrictions, no banking requirements, no permission needed. Just connect your wallet and your voice is heard. True borderless democracy.
                </p>
              </div>
            </div>
          </section>

          {/* Smart Contract Features */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">
              🛡️ Smart Contract Features
            </h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-green-900 mb-5 flex items-center gap-2">
                    <span className="text-2xl">✅</span> Security Features
                  </h4>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>One vote per wallet</strong> - Prevents spam and ensures fair voting</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>No admin control</strong> - Decentralized after deployment</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Automatic payouts</strong> - No manual intervention needed</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Time-locked expiration</strong> - Polls close exactly on schedule</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-blue-900 mb-5 flex items-center gap-2">
                    <span className="text-2xl">🔍</span> Transparency Features
                  </h4>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Public vote counts</strong> - Real-time visible to everyone</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Visible total funds</strong> - Track the prize pool live</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Open source contract</strong> - Code is publicly auditable</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span className="text-sm md:text-base text-gray-700"><strong>Etherscan verification</strong> - Independently verify all transactions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cleanup System */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">
              🧹 Automated Cleanup System
            </h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                After a poll ends and results are finalized, it remains visible on the platform for <strong>24 hours</strong> as a grace period. This allows voters to review final results and creators to claim their winnings. After this period, polls are automatically cleaned up to optimize blockchain storage costs.
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 md:p-6 border border-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📜</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-base md:text-lg">Permanent Blockchain Record</h4>
                    <p className="text-sm md:text-base text-gray-600">
                      While polls are removed from the UI after cleanup, all poll data, votes, and transactions remain permanently accessible on the Sepolia blockchain via Etherscan. The historical record is never deleted - it's just archived off the active interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6">
          <Link href="/getting-started" className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center">
            <span className="relative z-10">🚀 Getting Started Guide</span>
          </Link>
          <Link href="/" className="flex-1 group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center">
            <span className="relative z-10">📊 Browse Active Polls</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

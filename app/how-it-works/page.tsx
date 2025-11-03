'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            ← Back to Polls
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How BlockVote Works
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Decentralized polling platform where every voice matters. Transparent, secure, and community-driven.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">The Process</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-700 mb-2">
                    Link your MetaMask wallet to the Sepolia testnet. The platform automatically detects your wallet on both desktop and mobile.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    <strong>Mobile users:</strong> If MetaMask isn't detected, you'll be automatically redirected to open the site in the MetaMask app browser.
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create a Poll</h3>
                  <p className="text-gray-700 mb-3">
                    Set up your question with 2-6 answer options. Choose how long the poll runs (1 hour to 30 days). Decide if you want to bet on the outcome.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Costs:</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li className="flex justify-between"><span>Platform fee:</span> <span className="font-mono">0.005 ETH</span></li>
                      <li className="flex justify-between"><span>Optional bet:</span> <span className="font-mono">+0.001 ETH</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Place Your Bet (Optional)</h3>
                  <p className="text-gray-700 mb-3">
                    If you create a poll with a bet, pick which option you think will win. Your bet counts as your vote, and only you can see which option you chose.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <strong>Privacy:</strong> Your bet option stays hidden from other voters. They only see live vote percentages.
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Others Vote</h3>
                  <p className="text-gray-700 mb-3">
                    Anyone can vote by connecting their wallet and paying 0.001 ETH per vote. Each wallet can only vote once. Results update in real-time for everyone to see.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700">All votes are recorded on the blockchain and cannot be changed or deleted.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Poll Closes & Winner Determined</h3>
                  <p className="text-gray-700 mb-3">
                    When the time expires, anyone can trigger the finalization. The smart contract automatically counts votes and determines the winning option.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Payouts</h3>
                  <p className="text-gray-700 mb-3">
                    If the poll creator bet correctly, they receive 90% of all voting funds. If they bet wrong (or didn't bet), all funds go to the platform wallet.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-900 mb-2">Example:</p>
                    <p className="text-sm text-green-800">
                      Poll with 20 votes = 0.020 ETH collected<br/>
                      Creator bet correctly → Receives 0.018 ETH (90%)<br/>
                      Platform → Receives 0.002 ETH (10%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Blockchain?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-bold text-gray-900 mb-2">Immutable</h3>
                <p className="text-sm text-gray-700">
                  Once a vote is cast, it cannot be altered or deleted by anyone, including the poll creator.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-3xl mb-3">👁️</div>
                <h3 className="font-bold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-700">
                  Every transaction is publicly visible on Sepolia Etherscan. Anyone can verify results.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 mb-2">Automatic</h3>
                <p className="text-sm text-gray-700">
                  Smart contracts handle counting, payouts, and cleanup without human intervention.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-bold text-gray-900 mb-2">Global</h3>
                <p className="text-sm text-gray-700">
                  Anyone with MetaMask can participate from anywhere in the world.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Smart Contract Features</h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Security</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>One vote per wallet</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>No admin control after deployment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Automatic fund distribution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Time-locked poll expiration</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Transparency</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Public vote counts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Visible total funds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Open source contract</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Verifiable on Etherscan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cleanup System</h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4">
                After a poll ends and results are finalized, it remains visible for 24 hours. After this grace period, the poll is automatically cleaned up to optimize storage.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Poll data is still accessible on the blockchain via Etherscan even after cleanup from the UI.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/getting-started" className="btn-secondary text-center">
            Getting Started Guide
          </Link>
          <Link href="/" className="btn-primary text-center">
            Browse Polls
          </Link>
        </div>
      </main>
    </div>
  );
}

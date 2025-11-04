'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
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

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl p-5 md:p-7 mb-8 shadow-lg">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">⚠️</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-yellow-900 mb-2">TESTNET ONLY - NO REAL MONEY</h2>
              <p className="text-sm md:text-base text-yellow-800 leading-relaxed">
                BlockVote runs on <strong>Sepolia testnet</strong>. All transactions use test ETH with <strong>zero real-world value</strong>. This is a safe environment to learn and experiment with blockchain voting without any financial risk.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 mb-4 md:mb-5">
            Getting Started with BlockVote
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join the decentralized polling revolution in 4 simple steps. Get free test ETH and start participating in transparent, blockchain-powered decision making.
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-black">1</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Install MetaMask Wallet
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                MetaMask is your digital wallet that enables you to interact with blockchain applications. It's free, secure, and trusted by millions worldwide.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💻</span>
                    <h3 className="font-bold text-gray-900 text-lg">Desktop Users</h3>
                  </div>
                  <ul className="space-y-2 text-sm md:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span>Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-semibold underline">metamask.io</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span>Install browser extension (Chrome, Firefox, Edge, Brave)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span>Click the extension icon to get started</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📱</span>
                    <h3 className="font-bold text-gray-900 text-lg">Mobile Users</h3>
                  </div>
                  <ul className="space-y-2 text-sm md:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>Download from <strong>App Store</strong> (iOS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>Or <strong>Google Play</strong> (Android)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>Open the app and follow setup instructions</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🔐</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-2 text-base md:text-lg">Critical Security Warning</h4>
                    <p className="text-sm md:text-base text-red-800 leading-relaxed">
                      During setup, you'll receive a <strong>12-word secret recovery phrase</strong>. Write it down on paper and store it safely. <strong>Never share it with anyone</strong> or enter it on any website. MetaMask will never ask for it. Anyone with this phrase can access your wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-black">2</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Switch to Sepolia Testnet
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                Sepolia is Ethereum's official test network where you can experiment with blockchain applications using free test tokens. Let's connect MetaMask to Sepolia.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-2xl md:text-3xl flex-shrink-0">1️⃣</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">Open Network Menu</h4>
                    <p className="text-sm md:text-base text-gray-700">Click the network dropdown in MetaMask (usually shows "Ethereum Mainnet" at the top)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-2xl md:text-3xl flex-shrink-0">2️⃣</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">Enable Test Networks</h4>
                    <p className="text-sm md:text-base text-gray-700">If you don't see Sepolia, click Settings → Advanced → Show test networks (toggle ON)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-2xl md:text-3xl flex-shrink-0">3️⃣</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">Select Sepolia</h4>
                    <p className="text-sm md:text-base text-gray-700">Choose "Sepolia test network" from the network list. Your balance will show 0 ETH initially - that's normal!</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4 md:p-5">
                <p className="text-sm md:text-base text-blue-900">
                  <strong>💡 Pro Tip:</strong> When you connect your wallet to BlockVote, we'll automatically prompt you to switch to Sepolia if you're on a different network!
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-black">3</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Get Free Test ETH
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-green-100 hover:border-green-300 transition-all">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                Test ETH (Sepolia ETH) is completely free and has no real-world value. Use these faucets to get started - you'll need about <strong>0.01 ETH</strong> to create polls and vote.
              </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
              <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 md:p-6 border-2 border-green-300 hover:border-green-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    ⭐ Alchemy Faucet
                  </h3>
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Recommended</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-gray-700"><strong>Amount:</strong> <span className="text-green-700 font-semibold">0.5 ETH</span></p>
                  <p className="text-sm md:text-base text-gray-700"><strong>Frequency:</strong> Once per 24h</p>
                  <p className="text-sm text-gray-600 mt-3">Most reliable, requires login</p>
                </div>
              </a>

              <a href="https://sepolia-faucet.pk910.de" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 md:p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  ⛏️ PoW Faucet
                </h3>
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-gray-700"><strong>Amount:</strong> <span className="text-purple-700 font-semibold">Varies</span></p>
                  <p className="text-sm md:text-base text-gray-700"><strong>Frequency:</strong> Mining-based</p>
                  <p className="text-sm text-gray-600 mt-3">Earn by mining, no account needed</p>
                </div>
              </a>

              <a href="https://www.infura.io/faucet/sepolia" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 md:p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  🌐 Infura Faucet
                </h3>
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-gray-700"><strong>Amount:</strong> <span className="text-blue-700 font-semibold">0.5 ETH</span></p>
                  <p className="text-sm md:text-base text-gray-700"><strong>Frequency:</strong> Once per 24h</p>
                  <p className="text-sm text-gray-600 mt-3">Fast and reliable, account required</p>
                </div>
              </a>

              <a href="https://faucet.quicknode.com/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 md:p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  ⚡ QuickNode Faucet
                </h3>
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-gray-700"><strong>Amount:</strong> <span className="text-orange-700 font-semibold">0.1 ETH</span></p>
                  <p className="text-sm md:text-base text-gray-700"><strong>Frequency:</strong> Once per 12h</p>
                  <p className="text-sm text-gray-600 mt-3">Quick drips, more frequent claims</p>
                </div>
              </a>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-5 md:p-6 mt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💰</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 text-base md:text-lg">Cost Breakdown</h4>
                  <ul className="text-sm md:text-base text-blue-800 space-y-1">
                    <li>• Create a poll: <strong>0.005 ETH</strong></li>
                    <li>• Vote on a poll: <strong>0.001 ETH</strong> each</li>
                    <li>• Recommended starting balance: <strong>0.01 ETH</strong></li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-black">4</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Start Voting!
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                You're all set! Connect your wallet on BlockVote and start participating in decentralized polls. Every vote is recorded on the blockchain and counts toward transparent community decisions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">📝 Create Polls</h4>
                  <p className="text-sm md:text-base text-gray-700">Ask questions that matter to your community and optionally bet on the outcome</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">🗳️ Vote Freely</h4>
                  <p className="text-sm md:text-base text-gray-700">Cast your vote on active polls and see real-time results on the blockchain</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">📋 Contract Information</h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Network</p>
                  <p className="font-mono text-gray-900">Sepolia Testnet</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Chain ID</p>
                  <p className="font-mono text-gray-900">11155111</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600 mb-1">Contract Address</p>
                  <a
                    href="https://sepolia.etherscan.io/address/0x717D92da7276Fe3E9254539A68A3758640250372"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary-600 hover:underline break-all"
                  >
                    0x717D92da7276Fe3E9254539A68A3758640250372
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">🔒 Security Best Practices</h2>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-xl border-2 border-red-300">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl">
                  <span className="text-2xl flex-shrink-0">🔐</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1 text-base md:text-lg">Protect Your Recovery Phrase</h4>
                    <p className="text-sm md:text-base text-red-800"><strong>Never share</strong> your 12-word secret recovery phrase with anyone. MetaMask support will never ask for it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl">
                  <span className="text-2xl flex-shrink-0">✅</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1 text-base md:text-lg">Verify Contract Address</h4>
                    <p className="text-sm md:text-base text-red-800"><strong>Always verify</strong> the contract address matches our official one before approving transactions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl">
                  <span className="text-2xl flex-shrink-0">👛</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1 text-base md:text-lg">Separate Wallets</h4>
                    <p className="text-sm md:text-base text-red-800"><strong>Use separate wallets</strong> for testnet experimentation and mainnet real funds. Never mix them.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl">
                  <span className="text-2xl flex-shrink-0">💸</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1 text-base md:text-lg">Test ETH Has No Value</h4>
                    <p className="text-sm md:text-base text-red-800"><strong>Don't send real ETH</strong> to Sepolia testnet. Test ETH is free and worthless outside testing.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6">
          <Link href="/how-it-works" className="flex-1 group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center">
            <span className="relative z-10">💡 Learn How It Works</span>
          </Link>
          <Link href="/" className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center">
            <span className="relative z-10">🚀 Start Voting Now</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

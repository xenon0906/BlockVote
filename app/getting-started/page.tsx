'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function GettingStarted() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            ← Back to Polls
          </Link>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-900 mb-2">TESTNET ONLY - NO REAL MONEY</h2>
          <p className="text-yellow-800">
            BlockVote runs on Sepolia testnet. All transactions use test ETH with zero real-world value.
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Getting Started
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Create and vote on polls using blockchain. Free test ETH, no risk.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Install MetaMask
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Desktop:</strong> Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">metamask.io</a> and install the browser extension</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Mobile:</strong> Download MetaMask app from App Store or Google Play</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Create a new wallet or import existing one</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>IMPORTANT:</strong> Save your secret phrase securely</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Switch to Sepolia Network
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Open MetaMask and click the network dropdown (top left)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Enable "Show test networks" in settings if not visible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Select "Sepolia test network"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>You'll see your balance is 0 ETH (that's normal!)</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Get Free Test ETH
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-md border-2 border-primary-200 hover:border-primary-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Alchemy Faucet</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Recommended</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Amount: 0.5 ETH</p>
                <p className="text-sm text-gray-600">Frequency: Once per 24h</p>
              </a>

              <a href="https://sepolia-faucet.pk910.de" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-primary-300 transition-all">
                <h3 className="font-bold text-gray-900 mb-3">PoW Faucet</h3>
                <p className="text-sm text-gray-600 mb-2">Amount: Varies</p>
                <p className="text-sm text-gray-600">Frequency: Mining-based</p>
              </a>

              <a href="https://www.infura.io/faucet/sepolia" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-primary-300 transition-all">
                <h3 className="font-bold text-gray-900 mb-3">Infura Faucet</h3>
                <p className="text-sm text-gray-600 mb-2">Amount: 0.5 ETH</p>
                <p className="text-sm text-gray-600">Frequency: Once per 24h</p>
              </a>

              <a href="https://faucet.quicknode.com/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-primary-300 transition-all">
                <h3 className="font-bold text-gray-900 mb-3">QuickNode Faucet</h3>
                <p className="text-sm text-gray-600 mb-2">Amount: 0.1 ETH</p>
                <p className="text-sm text-gray-600">Frequency: Once per 12h</p>
              </a>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You need about 0.01 ETH to get started. This covers creating a poll (0.005 ETH) and voting a few times (0.001 ETH each).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contract Information</h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Tips</h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span><strong>Never share</strong> your secret recovery phrase with anyone</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span><strong>Always verify</strong> the contract address before interacting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span><strong>Use separate wallets</strong> for testnet and mainnet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span><strong>Test ETH has no value</strong> - don't send real money to this network</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/how-it-works" className="btn-secondary text-center">
            Learn How It Works
          </Link>
          <Link href="/" className="btn-primary text-center">
            Start Voting
          </Link>
        </div>
      </main>
    </div>
  );
}

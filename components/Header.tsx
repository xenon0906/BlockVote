'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { connectWallet, formatAddress } from '@/utils/wallet';

export default function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
    } else {
      setAddress(accounts[0]);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address: walletAddress } = await connectWallet();
      setAddress(walletAddress);
    } catch (error: any) {
      if (error.message !== 'Redirecting to MetaMask') {
        alert(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">B</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              BlockVote
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Polls
            </Link>
            <Link href="/getting-started" className="text-gray-700 hover:text-primary-600 transition-colors">
              Get Started
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            {address ? (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-accent-50 px-3 md:px-4 py-2 rounded-lg border border-primary-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm font-medium text-primary-900">
                  {formatAddress(address)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

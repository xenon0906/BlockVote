'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { connectWallet, formatAddress, ensureCorrectNetwork, getCurrentNetworkName } from '@/utils/wallet';

export default function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string>('');

  useEffect(() => {
    checkConnection();

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', (chainId: string) => {
        setIsWrongNetwork(chainId !== '0xaa36a7');
        window.location.reload();
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (showDropdown || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, mobileMenuOpen]);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          // Check if on correct network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const networkName = await getCurrentNetworkName();
          setCurrentNetwork(networkName);
          setIsWrongNetwork(chainId !== '0xaa36a7' && parseInt(chainId, 16) !== 11155111); // Check both hex and decimal
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

  const handleDisconnect = () => {
    setAddress(null);
    setShowDropdown(false);
    window.location.reload();
  };

  const handleSwitchAccount = async () => {
    setShowDropdown(false);
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.error('Error switching account:', error);
    }
  };

  const handleSwitchToSepolia = async () => {
    setShowDropdown(false);
    try {
      await ensureCorrectNetwork();
      // Reload to refresh network status
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to switch network: ${error.message}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 xs:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all animate-pulse"></div>
              <div className="relative w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="text-white font-black text-base xs:text-xl md:text-2xl drop-shadow-lg">🗳️</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-blue-400 transition-all duration-500">
                BlockVote
              </h1>
              <p className="text-[10px] xs:text-xs text-purple-300 font-semibold hidden 2xs:block group-hover:text-pink-300 transition-colors">
                ⚡ Powered by Blockchain
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Polls
            </Link>
            <Link href="/getting-started" className="px-4 py-2 text-sm font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Get Started
            </Link>
            <Link href="/how-it-works" className="px-4 py-2 text-sm font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Network Warning */}
            {address && isWrongNetwork && (
              <div className="bg-red-500/20 border border-red-400 rounded-lg px-2 xs:px-3 py-1.5 animate-pulse">
                <div className="flex flex-col items-center">
                  <span className="text-red-300 text-[10px] xs:text-xs font-bold">Wrong Network!</span>
                  <span className="text-red-200 text-[9px] xs:text-[10px]">{currentNetwork}</span>
                </div>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all mobile-menu-button"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            {address ? (
              <div className="relative wallet-dropdown">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1 xs:space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-2 xs:px-3 md:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-[11px] xs:text-xs md:text-sm font-bold text-white">
                    {formatAddress(address)}
                  </span>
                  <svg className={`w-3 h-3 xs:w-4 xs:h-4 text-purple-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500">Connected</p>
                        {isWrongNetwork ? (
                          <span className="text-xs text-red-600 font-bold">⚠️ {currentNetwork}</span>
                        ) : (
                          <span className="text-xs text-green-600 font-bold">✅ Sepolia</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{address}</p>
                    </div>
                    {isWrongNetwork && (
                      <button
                        onClick={handleSwitchToSepolia}
                        className="w-full px-4 py-2 text-left text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 animate-pulse"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-bold">Switch to Sepolia Network</span>
                      </button>
                    )}
                    <button
                      onClick={handleSwitchAccount}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>Switch Account</span>
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg xs:rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs xs:text-sm md:text-base px-3 xs:px-4 md:px-6 py-2 xs:py-2.5 md:py-3 rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <span className="hidden xs:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  <span className="xs:hidden">{isConnecting ? '...' : 'Connect'}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mobile-menu">
            <nav className="px-4 py-4 space-y-2 bg-slate-800/95 backdrop-blur-sm border-t border-purple-500/20">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Polls
              </Link>
              <Link
                href="/getting-started"
                className="block px-4 py-3 text-base font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                🚀 Get Started
              </Link>
              <Link
                href="/how-it-works"
                className="block px-4 py-3 text-base font-semibold text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                💡 How It Works
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

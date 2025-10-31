'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Vote, Trophy, Menu, X, Download, BookOpen, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Vote className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BlockVote
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/getting-started"
              className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Getting Started
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              How It Works
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 glass-effect rounded-lg hover:bg-primary/20 transition-all"
                title="Install App"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Install</span>
              </button>
            )}

            <div className="hidden sm:block">
              <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
              />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 glass-effect rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-slide-up">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 glass-effect rounded-lg hover:bg-white/10 transition-all"
            >
              Home
            </Link>
            <Link
              href="/getting-started"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 glass-effect rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Getting Started
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 glass-effect rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              How It Works
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 glass-effect rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            {showInstallButton && (
              <button
                onClick={() => {
                  handleInstallClick()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 glass-effect rounded-lg hover:bg-primary/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
            )}
            <div className="pt-2">
              <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

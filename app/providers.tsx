'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from '@/lib/config'
import { ReactNode, useEffect, useState } from 'react'
import { useTheme, ThemeProvider } from '@/lib/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // Cache for 30 seconds
      gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
      refetchInterval: false,
      refetchOnReconnect: false,
    },
  },
})

function RainbowKitWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <RainbowKitProvider
      theme={theme === 'dark' ? darkTheme({
        accentColor: '#6366f1',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      }) : lightTheme({
        accentColor: '#6366f1',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      })}
      modalSize="compact"
      initialChain={config.chains[0]}
      appInfo={{
        appName: 'BlockVote',
        learnMoreUrl: 'https://blockvoteapp.vercel.app',
        disclaimer: () => (
          <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
            By connecting your wallet, you agree to the Terms of Service and Privacy Policy
          </div>
        ),
      }}
    >
      {children}
    </RainbowKitProvider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider>
      <WagmiProvider config={config} reconnectOnMount={true}>
        <QueryClientProvider client={queryClient}>
          {mounted ? (
            <RainbowKitWrapper>
              {children}
            </RainbowKitWrapper>
          ) : (
            children
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

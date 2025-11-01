import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target() {
        return {
          id: 'injected',
          name: 'Browser Wallet',
          provider: typeof window !== 'undefined' ? window.ethereum : undefined,
        }
      },
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'BlockVote',
        description: 'Decentralized Voting on Ethereum',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://blockvoteapp.vercel.app',
        icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.svg` : 'https://blockvoteapp.vercel.app/icon.svg'],
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999',
        },
      },
    }),
    coinbaseWallet({
      appName: 'BlockVote',
      appLogoUrl: '/icon.svg',
    }),
  ],
  transports: {
    [sepolia.id]: http(undefined, {
      batch: {
        wait: 50, // Batch requests for better performance
      },
      retryCount: 3,
      timeout: 10000,
    }),
  },
  multiInjectedProviderDiscovery: true,
  ssr: true, // Enable SSR support
})

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

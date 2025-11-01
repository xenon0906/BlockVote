import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    // MetaMask and other injected wallets
    injected({
      shimDisconnect: true,
    }),
    // WalletConnect for mobile deep linking
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
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'BlockVote',
      appLogoUrl: '/icon.svg',
    }),
  ],
  transports: {
    [sepolia.id]: http(undefined, {
      batch: {
        wait: 50,
      },
      retryCount: 3,
      timeout: 10000,
    }),
  },
  multiInjectedProviderDiscovery: true,
  ssr: true,
})

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

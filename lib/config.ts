import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Blockchain Voting' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http({
      batch: {
        multicall: true,
      },
      retryCount: 2,
      timeout: 10_000,
    }),
  },
})

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

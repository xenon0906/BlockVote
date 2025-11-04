import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Cache provider instance for faster access
let cachedProvider: ethers.BrowserProvider | null = null;

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getMetaMaskDeepLink = (url: string) => {
  const dappUrl = url.replace(/^https?:\/\//, '');
  return `https://metamask.app.link/dapp/${dappUrl}`;
};

// Optimized: Check network without creating new provider
export const ensureCorrectNetwork = async () => {
  const sepoliaChainId = '0xaa36a7'; // Sepolia chain ID (11155111 in decimal)
  const sepoliaChainIdDecimal = 11155111;

  try {
    // Clear any cached network data
    if (cachedProvider) {
      cachedProvider = null;
    }

    // Fast check using eth_chainId
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

    // Handle both hex and decimal formats
    const currentChainIdNum = typeof currentChainId === 'string'
      ? parseInt(currentChainId, 16)
      : currentChainId;

    if (currentChainId !== sepoliaChainId && currentChainIdNum !== sepoliaChainIdDecimal) {
      try {
        // Force MetaMask to refresh network list
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Try to switch to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });

        // Wait a bit for network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (switchError: any) {
        // If Sepolia is not added to wallet, add it
        if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain')) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: sepoliaChainId,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [
                  'https://ethereum-sepolia-rpc.publicnode.com',
                  'https://rpc.sepolia.org',
                  'https://sepolia.infura.io/v3/'
                ],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } else if (switchError.code === 4001) {
          // User rejected the switch
          throw new Error('Please switch to Sepolia Test Network to use this app. This app uses test ETH, not real ETH.');
        } else {
          throw switchError;
        }
      }
    }

    return true;
  } catch (error: any) {
    console.error('Network check error:', error);
    if (error.message?.includes('Sepolia')) {
      throw error;
    }
    throw new Error('Failed to switch to Sepolia network. Please switch manually in MetaMask.');
  }
};

export const connectWallet = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Window not available');
  }

  if (isMobile() && !window.ethereum) {
    const currentUrl = window.location.href;
    window.location.href = getMetaMaskDeepLink(currentUrl);
    throw new Error('Redirecting to MetaMask');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    // Parallel execution for faster connection
    const [accounts] = await Promise.all([
      window.ethereum.request({ method: 'eth_requestAccounts' }),
      ensureCorrectNetwork(),
    ]);

    // Use cached provider or create new one
    if (!cachedProvider) {
      cachedProvider = new ethers.BrowserProvider(window.ethereum);
    }

    const signer = await cachedProvider.getSigner();
    return { provider: cachedProvider, signer, address: accounts[0] };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connection rejected');
    }
    throw error;
  }
};

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Return cached provider if available for faster access
    if (cachedProvider) return cachedProvider;
    cachedProvider = new ethers.BrowserProvider(window.ethereum);
    return cachedProvider;
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  try {
    // ALWAYS ensure correct network before returning signer
    await ensureCorrectNetwork();
    return await provider.getSigner();
  } catch {
    return null;
  }
};

export const formatAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatEther = (value: bigint) => {
  return parseFloat(ethers.formatEther(value)).toFixed(4);
};

// Get current network name for debugging
export const getCurrentNetworkName = async (): Promise<string> => {
  if (!window.ethereum) return 'No Wallet';

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const chainIdNum = parseInt(chainId, 16);

    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli',
      11155111: 'Sepolia',
      137: 'Polygon',
      80001: 'Mumbai',
      56: 'BSC',
      97: 'BSC Testnet',
      42161: 'Arbitrum',
      10: 'Optimism',
    };

    return networks[chainIdNum] || `Unknown (${chainId})`;
  } catch {
    return 'Unknown';
  }
};

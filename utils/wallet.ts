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
const ensureCorrectNetwork = async () => {
  const sepoliaChainId = '0xaa36a7'; // Sepolia chain ID (11155111 in decimal)

  try {
    // Fast check using eth_chainId
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

    if (currentChainId !== sepoliaChainId) {
      try {
        // Try to switch to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
      } catch (switchError: any) {
        // If Sepolia is not added to wallet, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: sepoliaChainId,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SepoliaETH',
                  decimals: 18,
                },
                rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
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

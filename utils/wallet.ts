import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getMetaMaskDeepLink = (url: string) => {
  const dappUrl = url.replace(/^https?:\/\//, '');
  return `https://metamask.app.link/dapp/${dappUrl}`;
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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    const network = await provider.getNetwork();
    const sepoliaChainId = 11155111n;

    if (network.chainId !== sepoliaChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }

    const signer = await provider.getSigner();
    return { provider, signer, address: accounts[0] };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connection rejected');
    }
    throw error;
  }
};

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  try {
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

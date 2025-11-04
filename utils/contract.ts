import { ethers } from 'ethers';
import BlockVoteABI from './BlockVoteABI.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const VOTE_COST = '0.001';
export const POLL_CREATION_FEE = '0.005';

export const getContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, BlockVoteABI, signerOrProvider);
};

export const createPoll = async (
  signer: ethers.Signer,
  question: string,
  options: string[],
  betOptionIndex: number,
  hasBet: boolean,
  durationInHours: number
) => {
  const contract = getContract(signer);
  const value = hasBet
    ? ethers.parseEther((parseFloat(POLL_CREATION_FEE) + parseFloat(VOTE_COST)).toString())
    : ethers.parseEther(POLL_CREATION_FEE);

  const tx = await contract.createPoll(
    question,
    options,
    betOptionIndex,
    hasBet,
    durationInHours,
    { value }
  );

  const receipt = await tx.wait();
  const event = receipt.logs.find((log: any) => {
    try {
      return contract.interface.parseLog(log)?.name === 'PollCreated';
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = contract.interface.parseLog(event);
    return parsed?.args[0];
  }
  return null;
};

export const vote = async (
  signer: ethers.Signer,
  pollId: number,
  optionIndex: number
): Promise<{ success: boolean; txHash?: string }> => {
  const contract = getContract(signer);

  // Timeout only for wallet/MetaMask response (10 seconds)
  const walletResponseTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), 10000);
  });

  try {
    // Race only the transaction submission (MetaMask opening/confirmation)
    const txPromise = contract.vote(pollId, optionIndex, {
      value: ethers.parseEther(VOTE_COST),
      gasLimit: 100000
    });

    const tx = await Promise.race([txPromise, walletResponseTimeout]) as ethers.ContractTransactionResponse;
    const txHash = tx.hash;

    // Wait for blockchain confirmation WITHOUT timeout - let it take as long as needed
    await tx.wait(1);

    return { success: true, txHash };
  } catch (error: any) {
    if (error.message === 'TIMEOUT') {
      throw new Error('TIMEOUT');
    }

    const errorStr = error.message?.toLowerCase() || '';
    const reason = error.reason?.toLowerCase() || '';
    const data = error.data?.message?.toLowerCase() || '';

    if (errorStr.includes('already voted') || reason.includes('already voted') || data.includes('already voted')) {
      throw new Error('ALREADY_VOTED');
    } else if (errorStr.includes('insufficient funds') || reason.includes('insufficient') || data.includes('insufficient')) {
      throw new Error('INSUFFICIENT_BALANCE');
    } else if (errorStr.includes('user rejected') || errorStr.includes('user denied')) {
      throw new Error('USER_REJECTED');
    } else if (errorStr.includes('network') || errorStr.includes('connection')) {
      throw new Error('NETWORK_ERROR');
    } else if (errorStr.includes('poll expired') || reason.includes('poll expired') || data.includes('poll expired')) {
      throw new Error('POLL_EXPIRED');
    } else if (errorStr.includes('poll finalized') || reason.includes('poll finalized') || data.includes('poll finalized')) {
      throw new Error('POLL_FINALIZED');
    } else if (errorStr.includes('invalid option') || reason.includes('invalid option') || data.includes('invalid option')) {
      throw new Error('INVALID_OPTION');
    }

    throw error;
  }
};

export const finalizePoll = async (signer: ethers.Signer, pollId: number) => {
  const contract = getContract(signer);
  const tx = await contract.finalizePoll(pollId);
  await tx.wait();
};

export const deletePoll = async (signer: ethers.Signer, pollId: number) => {
  const contract = getContract(signer);
  const tx = await contract.deletePoll(pollId);
  await tx.wait();
};

export const getPoll = async (provider: ethers.Provider, pollId: number) => {
  const contract = getContract(provider);
  return await contract.getPoll(pollId);
};

export const getPollOptions = async (provider: ethers.Provider, pollId: number) => {
  const contract = getContract(provider);
  return await contract.getPollOptions(pollId);
};

export const hasVoted = async (provider: ethers.Provider, pollId: number, address: string) => {
  const contract = getContract(provider);
  return await contract.hasVoted(pollId, address);
};

export const getActivePolls = async (provider: ethers.Provider, limit: number = 50) => {
  const contract = getContract(provider);
  return await contract.getActivePolls(limit);
};

export const getCompletedPolls = async (provider: ethers.Provider, limit: number = 20) => {
  const contract = getContract(provider);
  return await contract.getCompletedPolls(limit);
};

export const getCreatorBetOption = async (signer: ethers.Signer, pollId: number) => {
  const contract = getContract(signer);
  const address = await signer.getAddress();
  return await contract.getCreatorBetOption(pollId, address);
};

export const getPollExtended = async (provider: ethers.Provider, pollId: number) => {
  const contract = getContract(provider);
  const poll = await contract.polls(pollId);
  return {
    id: poll.id,
    question: poll.question,
    creator: poll.creator,
    createdAt: poll.createdAt,
    expiresAt: poll.expiresAt,
    finalizedAt: poll.finalizedAt,
    finalized: poll.finalized,
    deleted: poll.deleted,
    totalVotes: poll.totalVotes,
    totalFunds: poll.totalFunds,
    betOptionIndex: poll.betOptionIndex,
    hasBet: poll.hasBet,
    duration: poll.duration,
  };
};

export const getTotalPlatformVotes = async (provider: ethers.Provider) => {
  const contract = getContract(provider);
  const pollCount = await contract.pollCount();
  let totalVotes = BigInt(0);

  for (let i = 1; i <= Number(pollCount); i++) {
    try {
      const poll = await getPoll(provider, i);
      totalVotes += poll[6]; // totalVotes is at index 6
    } catch (error) {
      // Skip deleted or invalid polls
      continue;
    }
  }

  return totalVotes;
};

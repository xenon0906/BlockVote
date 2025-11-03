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

export const vote = async (signer: ethers.Signer, pollId: number, optionIndex: number) => {
  const contract = getContract(signer);
  const tx = await contract.vote(pollId, optionIndex, {
    value: ethers.parseEther(VOTE_COST)
  });
  await tx.wait();
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

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import BlockVoteABI from '@/utils/BlockVoteABI.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const privateKey = process.env.CLEANUP_PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing configuration' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, BlockVoteABI, wallet);

    const pollsToCleanup = await contract.getPollsReadyForCleanup();

    const results = {
      checked: pollsToCleanup.length,
      deleted: 0,
      errors: 0,
    };

    for (const pollId of pollsToCleanup) {
      try {
        const tx = await contract.deletePoll(pollId);
        await tx.wait();
        results.deleted++;
      } catch (error) {
        console.error(`Error deleting poll ${pollId}:`, error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: error.message || 'Cleanup failed' },
      { status: 500 }
    );
  }
}

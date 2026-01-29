import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/wagmi';
import { useEffect } from 'react';

export function useMintNFT() {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (metadataUrl: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [address, metadataUrl],
    });
  };

  return {
    mint,
    isPending,
    isConfirming,
    isSuccess,
    error,
    txHash: hash,
  };
}

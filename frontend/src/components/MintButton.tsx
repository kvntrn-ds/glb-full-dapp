import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { MintStatus } from '../types';

interface MintButtonProps {
  status: MintStatus;
  onClick: () => void;
  disabled?: boolean;
}

export function MintButton({ status, onClick, disabled }: MintButtonProps) {
  const getButtonContent = () => {
    switch (status.status) {
      case 'uploading':
        return (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Uploading to IPFS...
          </>
        );
      case 'minting':
        return (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Minting NFT...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Minted Successfully!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-5 w-5 mr-2" />
            Mint Failed - Try Again
          </>
        );
      default:
        return '🚀 Mint NFT';
    }
  };

  const getButtonStyle = () => {
    switch (status.status) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-primary hover:bg-blue-600';
    }
  };

  const isLoading = status.status === 'uploading' || status.status === 'minting';

  return (
    <div className="space-y-4">
      <button
        onClick={onClick}
        disabled={disabled || isLoading || status.status === 'success'}
        className={`w-full ${getButtonStyle()} text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center`}
      >
        {getButtonContent()}
      </button>

      {status.message && (
        <div
          className={`p-4 rounded-lg ${
            status.status === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : status.status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <p className="text-sm">{status.message}</p>
          {status.txHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline mt-2 inline-block"
            >
              View on BaseScan →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

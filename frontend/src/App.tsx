import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from './components/WalletConnect';
import { FileUpload } from './components/FileUpload';
import { ModelPreview } from './components/ModelPreview';
import { MetadataForm } from './components/MetadataForm';
import { MintButton } from './components/MintButton';
import { useIpfsUpload } from './hooks/useIpfsUpload';
import { useMintNFT } from './hooks/useMintNFT';
import type { UploadedFile, MintStatus } from './types';

function App() {
  const { isConnected } = useAccount();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [mintStatus, setMintStatus] = useState<MintStatus>({
    status: 'idle',
    message: '',
  });

  const { upload, isUploading } = useIpfsUpload();
  const { mint, isPending, isConfirming, isSuccess, error, txHash } = useMintNFT();

  const handleMetadataSubmit = async (name: string, description: string) => {
    if (!uploadedFile) return;

    setMintStatus({ status: 'uploading', message: 'Uploading to IPFS...' });

    try {
      const result = await upload(uploadedFile.file, name, description);
      setMetadataUrl(result.metadataUrl);
      setMintStatus({
        status: 'idle',
        message: 'Upload complete! Ready to mint.',
      });
    } catch (err) {
      setMintStatus({
        status: 'error',
        message: err instanceof Error ? err.message : 'Upload failed',
      });
    }
  };

  const handleMint = async () => {
    if (!metadataUrl) return;

    setMintStatus({ status: 'minting', message: 'Waiting for wallet confirmation...' });

    try {
      await mint(metadataUrl);
    } catch (err) {
      setMintStatus({
        status: 'error',
        message: err instanceof Error ? err.message : 'Minting failed',
      });
    }
  };

  // Update status based on mint hook state
  if (isPending && mintStatus.status !== 'minting') {
    setMintStatus({ status: 'minting', message: 'Confirm transaction in wallet...' });
  }

  if (isConfirming && mintStatus.status === 'minting') {
    setMintStatus({
      status: 'minting',
      message: 'Transaction submitted! Waiting for confirmation...',
      txHash,
    });
  }

  if (isSuccess && mintStatus.status !== 'success') {
    setMintStatus({
      status: 'success',
      message: '🎉 NFT minted successfully! Check your wallet.',
      txHash,
    });
  }

  if (error && mintStatus.status !== 'error') {
    setMintStatus({
      status: 'error',
      message: error.message || 'Transaction failed',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🎨 GLB to NFT
            </h1>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your wallet to start minting 3D NFTs on Base Sepolia
              </p>
              <WalletConnect />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Metadata */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  1. Upload GLB File
                </h2>
                <FileUpload onFileSelect={setUploadedFile} />
              </div>

              {uploadedFile && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    2. Add Metadata
                  </h2>
                  <MetadataForm
                    onSubmit={handleMetadataSubmit}
                    isDisabled={isUploading || mintStatus.status === 'uploading'}
                  />
                </div>
              )}

              {metadataUrl && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    3. Mint NFT
                  </h2>
                  <MintButton
                    status={mintStatus}
                    onClick={handleMint}
                    disabled={!metadataUrl}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              {uploadedFile && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    3D Preview
                  </h2>
                  <ModelPreview modelUrl={uploadedFile.preview} />
                </div>
              )}

              {mintStatus.status === 'success' && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-green-600 mb-4">
                    ✅ Success!
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Your NFT has been minted on Base Sepolia!
                    </p>
                    <div className="bg-gray-50 rounded p-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Network:</span> Base Sepolia
                      </p>
                      {txHash && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">TX Hash:</span>{' '}
                          <a
                            href={`https://sepolia.basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline break-all"
                          >
                            {txHash}
                          </a>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Mint Another NFT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Built with React, wagmi, and ❤️ on Base Sepolia
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

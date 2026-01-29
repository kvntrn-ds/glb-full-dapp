export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface UploadedFile {
  file: File;
  preview: string;
  size: number;
}

export interface IpfsUploadResult {
  cid: string;
  gatewayUrl: string;
}

export interface MintStatus {
  status: 'idle' | 'uploading' | 'minting' | 'success' | 'error';
  message: string;
  txHash?: string;
  tokenId?: number;
}

import axios from 'axios';
import type { NFTMetadata, IpfsUploadResult } from '../types';

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

/**
 * Upload GLB file to IPFS via Pinata
 */
export async function uploadGLBToPinata(file: File): Promise<IpfsUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append('pinataOptions', options);

  try {
    const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    const cid = response.data.IpfsHash;
    const gatewayUrl = `${PINATA_GATEWAY}/ipfs/${cid}`;

    return { cid, gatewayUrl };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Failed to upload GLB file to IPFS');
  }
}

/**
 * Upload NFT metadata JSON to IPFS via Pinata
 */
export async function uploadMetadataToPinata(metadata: NFTMetadata): Promise<IpfsUploadResult> {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    const cid = response.data.IpfsHash;
    const gatewayUrl = `${PINATA_GATEWAY}/ipfs/${cid}`;

    return { cid, gatewayUrl };
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Complete upload workflow: GLB + Metadata
 */
export async function uploadCompleteNFT(
  file: File,
  name: string,
  description: string
): Promise<{ modelUrl: string; metadataUrl: string }> {
  // Upload GLB file
  const modelUpload = await uploadGLBToPinata(file);

  // Create metadata
  const metadata: NFTMetadata = {
    name,
    description,
    image: modelUpload.gatewayUrl,
    animation_url: modelUpload.gatewayUrl,
    attributes: [
      { trait_type: 'Format', value: 'GLB' },
      { trait_type: 'Size', value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
      { trait_type: 'Upload Date', value: new Date().toISOString() },
    ],
  };

  // Upload metadata
  const metadataUpload = await uploadMetadataToPinata(metadata);

  return {
    modelUrl: modelUpload.gatewayUrl,
    metadataUrl: metadataUpload.gatewayUrl,
  };
}

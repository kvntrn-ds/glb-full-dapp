// upload-to-ipfs.js
// Upload GLB file and metadata to IPFS via Pinata

import 'dotenv/config';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadToIPFS() {
  console.log('🟣 Uploading to IPFS via Pinata...\n');
  
  // Get file path from command line
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npm run upload <path-to-glb> [name] [description]');
    console.error('Example: npm run upload "../lowpoly car.glb" "Dragon NFT" "A 3D dragon"');
    process.exit(1);
  }
  
  const filePath = path.resolve(__dirname, args[0]);
  const nftName = args[1] || 'Solana GLB NFT';
  const nftDescription = args[2] || 'A 3D model NFT minted on Solana';
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  
  console.log(`📁 File: ${fileName}`);
  console.log(`📏 Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  const pinataJWT = process.env.PINATA_JWT;
  if (!pinataJWT) {
    console.error('❌ PINATA_JWT not found in .env');
    process.exit(1);
  }
  
  // Upload GLB file
  console.log('⏳ Step 1: Uploading GLB to IPFS...');
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  
  const metadata = JSON.stringify({ name: fileName });
  formData.append('pinataMetadata', metadata);
  
  const uploadResponse = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${pinataJWT}`
      }
    }
  );
  
  const glbCid = uploadResponse.data.IpfsHash;
  const glbUrl = `${process.env.PINATA_GATEWAY}/ipfs/${glbCid}`;
  
  console.log(`✅ GLB uploaded!`);
  console.log(`   CID: ${glbCid}`);
  console.log(`   URL: ${glbUrl}\n`);
  
  // Create metadata JSON
  console.log('⏳ Step 2: Creating and uploading metadata...');
  const metadataJson = {
    name: nftName,
    symbol: 'GLB3D',
    description: nftDescription,
    image: glbUrl,
    animation_url: glbUrl,
    external_url: glbUrl,
    attributes: [
      { trait_type: 'Format', value: 'GLB' },
      { trait_type: 'Size', value: `${(fileSize / 1024 / 1024).toFixed(2)} MB` },
      { trait_type: 'Network', value: 'Solana' }
    ],
    properties: {
      files: [
        {
          uri: glbUrl,
          type: 'model/gltf-binary'
        }
      ],
      category: '3d'
    }
  };
  
  const metadataResponse = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    metadataJson,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pinataJWT}`
      }
    }
  );
  
  const metadataCid = metadataResponse.data.IpfsHash;
  const metadataUrl = `${process.env.PINATA_GATEWAY}/ipfs/${metadataCid}`;
  
  console.log(`✅ Metadata uploaded!`);
  console.log(`   CID: ${metadataCid}`);
  console.log(`   URL: ${metadataUrl}\n`);
  
  console.log('═══════════════════════════════════════');
  console.log('✅ Upload Complete!\n');
  console.log('📋 NFT Details:');
  console.log(`   Name: ${nftName}`);
  console.log(`   Description: ${nftDescription}\n`);
  console.log('🔗 URLs:');
  console.log(`   Model: ${glbUrl}`);
  console.log(`   Metadata: ${metadataUrl}\n`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('🚀 Next Step: Mint NFT');
  console.log(`   npm run mint "${metadataUrl}" "${nftName}"\n`);
  
  // Save to file for easy reference
  const output = {
    modelUrl: glbUrl,
    metadataUrl: metadataUrl,
    name: nftName,
    description: nftDescription,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('last-upload.json', JSON.stringify(output, null, 2));
  console.log('💾 Details saved to: last-upload.json\n');
}

uploadToIPFS().catch((error) => {
  console.error('❌ Upload failed:', error.message);
  process.exit(1);
});

// compress-upload-mint.ts
import 'dotenv/config';  // Loads .env automatically → process.env.PINATA_JWT etc.

import { PinataSDK } from 'pinata';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For TypeScript ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Pinata (do this once)
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY,  // optional
});

async function main() {
  // 1. Get input file from command line arg
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npx tsx compress-upload-mint.ts <path-to-glb>');
    console.error('Example: npx tsx compress-upload-mint.ts ./models/cool-dragon.glb');
    process.exit(1);
  }

  const inputPath = path.resolve(__dirname, args[0]);
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const fileName = path.basename(inputPath);
  console.log(`Processing: ${fileName}`);

  // 2. Optional: Compress GLB here
  // Placeholder – integrate gltfpack, draco, etc. for real compression
  // Example pseudo-code:
  // const compressedBuffer = await compressGlb(inputPath);  // your compression fn
  // For now, just use original
  const fileStream = fs.createReadStream(inputPath);

  // But Pinata SDK expects File/Blob in browser-like env; for Node use upload.content
  // We'll read as buffer for simplicity
  const fileBuffer = fs.readFileSync(inputPath);

  console.log('Uploading GLB to Pinata...');

  // 3. Upload model file
  const modelUpload = await pinata.upload.public.file(new File([fileBuffer], fileName, { type: 'model/gltf-binary' }), {
    name: fileName,  // optional metadata
    // groupId: 'your-group-id-if-using-groups',
  });

  const modelCid = modelUpload.cid;
  const modelIpfsUrl = `ipfs://${modelCid}`;
  const modelGatewayUrl = await pinata.gateways.public.convert(modelCid);  // https://...mypinata.cloud/ipfs/...

  console.log('GLB uploaded!');
  console.log('IPFS CID (model):', modelCid);
  console.log('Gateway URL (model):', modelGatewayUrl);

  // 4. Create & upload NFT metadata JSON
  const metadata = {
    name: 'Cool Dragon',
    description: 'A majestic compressed dragon GLB model minted as NFT',
    image: modelGatewayUrl,  // or use a separate thumbnail/preview image
    animation_url: modelGatewayUrl,  // for 3D models in wallets/viewers
    attributes: [
      { trait_type: 'Format', value: 'GLB' },
      { trait_type: 'Size', value: `${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB` },
      // add more: rarity, edition, etc.
    ],
    external_url: 'https://your-site.com/cool-dragon',  // optional
  };

  const metadataJson = JSON.stringify(metadata, null, 2);
  const metadataFile = new File([metadataJson], 'metadata.json', { type: 'application/json' });

  console.log('Uploading metadata JSON...');
  const metadataUpload = await pinata.upload.public.file(metadataFile);

  const metadataCid = metadataUpload.cid;
  const metadataIpfsUrl = `ipfs://${metadataCid}`;
  const metadataGatewayUrl = await pinata.gateways.public.convert(metadataCid);

  console.log('Metadata uploaded!');
  console.log('IPFS CID (metadata):', metadataCid);
  console.log('Gateway URL (metadata):', metadataGatewayUrl);
  console.log('\nReady for minting! Use metadata URL:');
  console.log(metadataGatewayUrl);
  console.log('(e.g. in your smart contract: tokenURI = metadataGatewayUrl)');
}

// Run and handle errors
main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
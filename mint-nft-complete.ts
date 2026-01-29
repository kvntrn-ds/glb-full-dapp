// mint-nft-complete.ts
// Complete workflow: Upload GLB → Create metadata → Mint NFT (all in one)

import 'dotenv/config';
import { PinataSDK } from 'pinata';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Remove import.meta – use __dirname from path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // ============================================
  // 1. VALIDATE INPUTS
  // ============================================
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npx tsx mint-nft-complete.ts <path-to-glb> [name] [description]');
    console.error('Example: npx tsx mint-nft-complete.ts ./lowpoly car.glb "Dragon NFT" "A majestic 3D dragon"');
    process.exit(1);
  }

  const inputPath = path.resolve(__dirname, args[0]);
  const nftName = args[1] || 'GLB NFT';
  const nftDescription = args[2] || 'A 3D model NFT minted from GLB file';

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const fileName = path.basename(inputPath);
  console.log('🚀 Starting complete NFT minting workflow...\n');
  console.log(`📁 File: ${fileName}`);
  console.log(`📝 Name: ${nftName}`);
  console.log(`📄 Description: ${nftDescription}\n`);

  // ============================================
  // 2. SETUP PINATA (Upload to IPFS)
  // ============================================
  console.log('⏳ Step 1: Uploading GLB to Pinata...');
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.PINATA_GATEWAY,
  });

  const fileBuffer = fs.readFileSync(inputPath);
  const modelUpload = await pinata.upload.public.file(
    new File([fileBuffer], fileName, { type: 'model/gltf-binary' }),
    { name: fileName }
  );

  const modelCid = modelUpload.cid;
  const modelGatewayUrl = await pinata.gateways.public.convert(modelCid);
  console.log(`✅ GLB uploaded!`);
  console.log(`   CID: ${modelCid}`);
  console.log(`   URL: ${modelGatewayUrl}\n`);

  // ============================================
  // 3. CREATE & UPLOAD METADATA
  // ============================================
  console.log('⏳ Step 2: Creating and uploading metadata...');
  const metadata = {
    name: nftName,
    description: nftDescription,
    image: modelGatewayUrl,
    animation_url: modelGatewayUrl,
    attributes: [
      { trait_type: 'Format', value: 'GLB' },
      { trait_type: 'Size', value: `${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB` },
    ],
  };

  const metadataJson = JSON.stringify(metadata, null, 2);
  const metadataFile = new File([metadataJson], 'metadata.json', { type: 'application/json' });
  const metadataUpload = await pinata.upload.public.file(metadataFile);

  const metadataCid = metadataUpload.cid;
  const metadataGatewayUrl = await pinata.gateways.public.convert(metadataCid);
  console.log(`✅ Metadata uploaded!`);
  console.log(`   CID: ${metadataCid}`);
  console.log(`   URL: ${metadataGatewayUrl}\n`);

  // ============================================
  // 4. SETUP BLOCKCHAIN & MINT
  // ============================================
  console.log('⏳ Step 3: Minting NFT on Base Sepolia...');
  const rpcUrl = process.env.RPC_URL!;
  const privateKey = process.env.PRIVATE_KEY!;
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const recipientAddress = process.env.RECIPIENT_ADDRESS!;

  if (!rpcUrl || !privateKey || !contractAddress || !recipientAddress) {
    throw new Error('Missing blockchain configuration in .env');
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  console.log(`   Minter: ${signer.address}`);
  console.log(`   Recipient: ${recipientAddress}`);

  // Get balance check
  const balance = await provider.getBalance(signer.address);
  console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === BigInt(0)) {
    throw new Error('❌ Insufficient funds! Get testnet ETH from a faucet.');
  }

  // Contract ABI
  const abi = [
    'function mint(address recipient, string memory tokenURI) public returns (uint256)',
  ];

  // Create contract instance and mint
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const tx = await contract.mint(recipientAddress, metadataGatewayUrl);
    console.log(`   TX Hash: ${tx.hash}`);
    console.log('   ⏳ Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log(`✅ NFT Minted successfully!\n`);

    // ============================================
    // 5. DISPLAY RESULTS
    // ============================================
    console.log('🎉 ==================== COMPLETE ====================');
    console.log(`✅ NFT Successfully Minted!`);
    console.log(`\n📊 Details:`);
    console.log(`   Token ID: 0`);
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Owner: ${recipientAddress}`);
    console.log(`   Network: Base Sepolia`);
    console.log(`\n🔗 Links:`);
    console.log(`   TX: https://sepolia.basescan.org/tx/${tx.hash}`);
    console.log(`   Contract: https://sepolia.basescan.org/address/${contractAddress}`);
    console.log(`   Metadata: ${metadataGatewayUrl}`);
    console.log(`   Model: ${modelGatewayUrl}`);
    console.log(`\n📱 View in MetaMask:`);
    console.log(`   1. Open MetaMask → NFTs tab`);
    console.log(`   2. Click "Import NFT"`);
    console.log(`   3. Contract: ${contractAddress}`);
    console.log(`   4. Token ID: 0`);
    console.log(`\n====================================================\n`);
  } catch (error: any) {
    console.error('❌ Error minting NFT:', error.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

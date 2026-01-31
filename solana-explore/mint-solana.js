// mint-solana.js
// Mint NFT on Solana using Metaplex (NO RUST!)

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import bs58 from 'bs58';
import fs from 'fs';

async function mintSolanaNFT() {
  console.log('🟣 Minting NFT on Solana...\n');
  
  // Get metadata URL from command line or last upload
  const args = process.argv.slice(2);
  let metadataUri, nftName;
  
  if (args.length === 0) {
    // Try to use last upload
    if (fs.existsSync('last-upload.json')) {
      const lastUpload = JSON.parse(fs.readFileSync('last-upload.json', 'utf8'));
      metadataUri = lastUpload.metadataUrl;
      nftName = lastUpload.name;
      console.log('📋 Using last upload:');
      console.log(`   Name: ${nftName}`);
      console.log(`   Metadata: ${metadataUri}\n`);
    } else {
      console.error('Usage: npm run mint [metadata-url] [nft-name]');
      console.error('Or run: npm run upload first\n');
      process.exit(1);
    }
  } else {
    metadataUri = args[0];
    nftName = args[1] || 'Solana GLB NFT';
  }
  
  // Setup network
  const network = process.env.SOLANA_NETWORK || 'devnet';
  const rpcUrl = network === 'mainnet' 
    ? process.env.SOLANA_RPC_MAINNET 
    : process.env.SOLANA_RPC_DEVNET;
  
  console.log(`📍 Network: ${network.toUpperCase()}`);
  console.log(`📍 RPC: ${rpcUrl}\n`);
  
  // Load wallet
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ SOLANA_PRIVATE_KEY not found in .env');
    console.log('   Run: npm run setup\n');
    process.exit(1);
  }
  
  const secretKey = bs58.decode(privateKey);
  const keypair = Keypair.fromSecretKey(secretKey);
  
  console.log(`📍 Wallet: ${keypair.publicKey.toBase58()}\n`);
  
  // Check balance
  const connection = new Connection(rpcUrl, 'confirmed');
  const balance = await connection.getBalance(keypair.publicKey);
  const solBalance = balance / LAMPORTS_PER_SOL;
  
  console.log(`💰 Balance: ${solBalance} SOL\n`);
  
  if (solBalance < 0.01) {
    console.error('❌ Insufficient SOL!');
    if (network === 'devnet') {
      console.log(`   Get free SOL: https://faucet.solana.com`);
      console.log(`   Paste: ${keypair.publicKey.toBase58()}\n`);
    } else {
      console.log('   Buy SOL and send to your wallet\n');
    }
    process.exit(1);
  }
  
  // Setup Umi with actual wallet
  const umi = createUmi(rpcUrl).use(mplTokenMetadata());
  
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  const signer = createSignerFromKeypair(umi, umiKeypair);
  umi.use(signerIdentity(signer));
  
  // Generate mint address
  const mint = generateSigner(umi);
  
  console.log('⏳ Minting NFT...');
  console.log(`   Name: ${nftName}`);
  console.log(`   Metadata: ${metadataUri}\n`);
  
  try {
    await createNft(umi, {
      mint,
      name: nftName,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5, 2), // 5% royalty
      creators: [
        {
          address: signer.publicKey,
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi);
    
    console.log('✅ NFT Minted Successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Mint Address: ${mint.publicKey}`);
    console.log(`🔍 Explorer: https://explorer.solana.com/address/${mint.publicKey}?cluster=${network}`);
    console.log(`💰 Cost: ~${(balance - await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL} SOL`);
    console.log('═══════════════════════════════════════\n');
    
    if (network === 'devnet') {
      console.log('💡 This is a TESTNET NFT (no real value)');
      console.log('   To mint on mainnet, update .env: SOLANA_NETWORK=mainnet\n');
    } else {
      console.log('🎉 Real Solana NFT minted!');
      console.log('   View on Magic Eden or other marketplaces\n');
    }
    
  } catch (error) {
    console.error('❌ Minting failed:', error.message);
    process.exit(1);
  }
}

mintSolanaNFT().catch(console.error);

// check-balance.js
// Check Solana wallet balance

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

async function checkBalance() {
  console.log('🟣 Checking Solana Balance...\n');
  
  const network = process.env.SOLANA_NETWORK || 'devnet';
  const rpcUrl = network === 'mainnet' 
    ? process.env.SOLANA_RPC_MAINNET 
    : process.env.SOLANA_RPC_DEVNET;
  
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ SOLANA_PRIVATE_KEY not found in .env');
    console.log('   Run: npm run setup\n');
    process.exit(1);
  }
  
  // Decode private key
  const secretKey = bs58.decode(privateKey);
  const keypair = Keypair.fromSecretKey(secretKey);
  
  // Connect to network
  const connection = new Connection(rpcUrl, 'confirmed');
  
  console.log(`📍 Network: ${network.toUpperCase()}`);
  console.log(`📍 RPC: ${rpcUrl}`);
  console.log(`📍 Wallet: ${keypair.publicKey.toBase58()}\n`);
  
  // Get balance
  const balance = await connection.getBalance(keypair.publicKey);
  const solBalance = balance / LAMPORTS_PER_SOL;
  
  console.log(`💰 Balance: ${solBalance} SOL\n`);
  
  if (network === 'devnet') {
    if (solBalance < 0.1) {
      console.log('⚠️  Low balance for devnet testing');
      console.log(`   Get free SOL: https://faucet.solana.com`);
      console.log(`   Paste wallet: ${keypair.publicKey.toBase58()}\n`);
    } else {
      console.log('✅ Sufficient devnet SOL for testing!\n');
    }
  } else {
    const mintCost = 0.01; // Rough estimate
    if (solBalance < mintCost) {
      console.log('❌ Insufficient SOL for minting');
      console.log(`   Need: ~${mintCost} SOL`);
      console.log(`   Have: ${solBalance} SOL\n`);
    } else {
      console.log('✅ Sufficient SOL for minting!');
      console.log(`   Estimated cost: ~0.01 SOL (~$2 USD)\n`);
    }
  }
}

checkBalance().catch(console.error);

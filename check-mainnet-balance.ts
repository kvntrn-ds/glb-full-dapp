// check-mainnet-balance.ts
// Safety check: verify you have ETH before deploying

import 'dotenv/config';
import { ethers } from 'ethers';

async function checkBalance() {
  console.log('🔍 Checking Base Mainnet Balance...\n');
  
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ PRIVATE_KEY not found in .env');
    process.exit(1);
  }
  
  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`📍 Wallet Address: ${wallet.address}`);
  
  const balance = await provider.getBalance(wallet.address);
  const ethBalance = ethers.formatEther(balance);
  
  console.log(`💰 Balance: ${ethBalance} ETH\n`);
  
  // Check if sufficient
  const minRequired = 0.01;
  const balanceNum = parseFloat(ethBalance);
  
  if (balanceNum < minRequired) {
    console.log('❌ INSUFFICIENT BALANCE!');
    console.log(`   Need at least ${minRequired} ETH for deployment`);
    console.log(`   Current: ${ethBalance} ETH`);
    console.log(`   Missing: ${(minRequired - balanceNum).toFixed(4)} ETH\n`);
    console.log('💡 Get ETH:');
    console.log('   • Bridge: https://bridge.base.org');
    console.log('   • Buy on Coinbase and withdraw to Base\n');
    process.exit(1);
  }
  
  console.log('✅ Sufficient balance for deployment!');
  console.log(`   Deployment cost: ~0.01 ETH (~$30)`);
  console.log(`   Your balance: ${ethBalance} ETH`);
  console.log(`   Remaining after: ~${(balanceNum - 0.01).toFixed(4)} ETH\n`);
  
  console.log('🚀 Ready to deploy to mainnet!');
  console.log('   Run: npx tsx deploy-mainnet.ts\n');
}

checkBalance().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

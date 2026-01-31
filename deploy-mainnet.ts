// deploy-mainnet.ts
// Deploy GLBToNFT contract to Base mainnet

import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';

async function main() {
  console.log('🚀 Deploying to Base Mainnet...\n');
  
  // MAINNET CONFIGURATION
  const RPC_URL = 'https://mainnet.base.org';
  const CHAIN_ID = 8453;
  
  // Safety check
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('❌ PRIVATE_KEY not found in .env');
  }
  
  // Connect to Base mainnet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log(`📍 Deployer: ${deployer.address}`);
  
  // Check balance (need at least 0.01 ETH)
  const balance = await provider.getBalance(deployer.address);
  const ethBalance = ethers.formatEther(balance);
  console.log(`💰 Balance: ${ethBalance} ETH`);
  
  if (balance < ethers.parseEther('0.01')) {
    throw new Error('❌ Insufficient ETH! Need at least 0.01 ETH for deployment.');
  }
  
  // Confirm mainnet deployment
  console.log('\n⚠️  WARNING: Deploying to MAINNET with REAL ETH!');
  console.log('   Chain ID:', CHAIN_ID);
  console.log('   RPC:', RPC_URL);
  console.log('   Estimated cost: ~0.01 ETH (~$30 USD)\n');
  
  // Wait for confirmation (comment out for CI/CD)
  console.log('⏳ Deploying in 5 seconds... (Ctrl+C to cancel)\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Read compiled contract
  const contractPath = './artifacts/contracts/GLBToNFT.sol/GLBToNFT.json';
  if (!fs.existsSync(contractPath)) {
    throw new Error('❌ Contract not compiled! Run: npx hardhat compile');
  }
  
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const abi = contractJson.abi;
  const bytecode = contractJson.bytecode;
  
  // Deploy contract
  console.log('📤 Deploying GLBToNFT contract...');
  const factory = new ethers.ContractFactory(abi, bytecode, deployer);
  const contract = await factory.deploy(deployer.address); // Owner = deployer
  
  console.log(`⏳ TX Hash: ${contract.deploymentTransaction()?.hash}`);
  console.log('   Waiting for confirmation...\n');
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log('✅ Contract Deployed Successfully!\n');
  console.log('═══════════════════════════════════════');
  console.log(`📍 Contract Address: ${address}`);
  console.log(`🔍 BaseScan: https://basescan.org/address/${address}`);
  console.log(`🔗 Add to .env: CONTRACT_ADDRESS=${address}`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('💡 Next Steps:');
  console.log('   1. Verify contract on BaseScan (optional)');
  console.log('   2. Update CONTRACT_ADDRESS in .env');
  console.log('   3. Update frontend/.env with new address');
  console.log('   4. Test mint with: npx tsx mint-nft-complete.ts\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  });

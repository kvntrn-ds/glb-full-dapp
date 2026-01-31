// setup-wallet.js
// Generate a new Solana wallet or import existing one

import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import bs58 from 'bs58';

console.log('🟣 Solana Wallet Setup\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync('.env.example', '.env');
}

const envContent = fs.readFileSync('.env', 'utf8');
const hasKey = envContent.includes('SOLANA_PRIVATE_KEY=') && 
                envContent.split('SOLANA_PRIVATE_KEY=')[1].split('\n')[0].trim().length > 0;

if (hasKey) {
  console.log('✅ Wallet already configured in .env\n');
  console.log('To create a new wallet, delete SOLANA_PRIVATE_KEY from .env first.');
  process.exit(0);
}

// Generate new keypair
console.log('🔑 Generating new Solana wallet...\n');
const keypair = Keypair.generate();

// Convert to base58 private key
const privateKeyBase58 = bs58.encode(keypair.secretKey);

console.log('═══════════════════════════════════════');
console.log('✅ Wallet Generated Successfully!\n');
console.log(`📍 Public Address (Wallet):`);
console.log(`   ${keypair.publicKey.toBase58()}\n`);
console.log(`🔐 Private Key (base58):`);
console.log(`   ${privateKeyBase58}\n`);
console.log('═══════════════════════════════════════\n');

// Update .env file
const updatedEnv = envContent.replace(
  /SOLANA_PRIVATE_KEY=.*/,
  `SOLANA_PRIVATE_KEY=${privateKeyBase58}`
);

fs.writeFileSync('.env', updatedEnv);

console.log('✅ Private key saved to .env file\n');
console.log('⚠️  SECURITY WARNING:');
console.log('   • Never share your private key');
console.log('   • Never commit .env to GitHub');
console.log('   • Backup this key somewhere safe\n');

console.log('💰 Next Steps:\n');
console.log('1. Fund your wallet:');
console.log(`   • Devnet (FREE): https://faucet.solana.com`);
console.log(`     Paste: ${keypair.publicKey.toBase58()}`);
console.log(`   • Mainnet: Buy SOL and send to above address\n`);
console.log('2. Check balance:');
console.log(`   npm run balance\n`);
console.log('3. Mint NFT:');
console.log(`   npm run mint\n`);

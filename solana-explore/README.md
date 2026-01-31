# Solana NFT Minting (No Rust Required!)

Mint 3D GLB NFTs on Solana for **~$0.50** instead of $30 on EVM chains.

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd solana-explore
npm install
```

### Step 2: Setup Wallet

```bash
npm run setup
```

This generates a new Solana wallet and saves it to `.env`. You'll see:
```
✅ Wallet Generated Successfully!

📍 Public Address: 7xKW...abc123
🔐 Private Key: [saved to .env]
```

**IMPORTANT**: Backup your wallet! Copy the address and private key somewhere safe.

### Step 3: Fund Wallet (FREE for Devnet)

**For testing (devnet - FREE):**
1. Visit https://faucet.solana.com
2. Paste your wallet address
3. Click "Confirm Airdrop"
4. Get 1-2 SOL (testnet tokens)

**For production (mainnet - costs real money):**
- Buy SOL on exchange (Coinbase, Binance)
- Send to your wallet address
- Need ~0.05 SOL ($10) for testing

### Step 4: Check Balance

```bash
npm run balance
```

Output:
```
💰 Balance: 1.5 SOL
✅ Sufficient devnet SOL for testing!
```

### Step 5: Upload GLB to IPFS

```bash
npm run upload "../lowpoly car.glb" "Dragon NFT" "A 3D dragon model"
```

This uploads your GLB file and metadata to IPFS via Pinata. Output:
```
✅ Upload Complete!

🔗 URLs:
   Model: https://gateway.pinata.cloud/ipfs/Qm...
   Metadata: https://gateway.pinata.cloud/ipfs/Qm...

💾 Details saved to: last-upload.json
```

### Step 6: Mint NFT!

```bash
npm run mint
```

Or specify metadata URL manually:
```bash
npm run mint "https://gateway.pinata.cloud/ipfs/Qm..." "Dragon NFT"
```

Output:
```
✅ NFT Minted Successfully!

📍 Mint Address: 8xPW...xyz789
🔍 Explorer: https://explorer.solana.com/address/8xPW...
💰 Cost: ~0.0015 SOL (~$0.30 USD)
```

---

## 📊 Cost Comparison

| Action | Ethereum | Base | Solana |
|--------|----------|------|--------|
| **Deploy Contract** | $200+ | $20-30 | $0 (pre-deployed) |
| **Mint NFT** | $10-50 | $1-3 | $0.30-0.50 |
| **Total for 10 NFTs** | $300+ | $40+ | **$5** ✅ |

Solana is **60x cheaper** than Base and **100x cheaper** than Ethereum!

---

## 🔄 Switch Between Testnet & Mainnet

Edit `.env`:

**For FREE testing (devnet):**
```env
SOLANA_NETWORK=devnet
```

**For REAL NFTs (mainnet):**
```env
SOLANA_NETWORK=mainnet
```

Everything else stays the same! Just update that one line.

---

## 📱 View Your NFTs

### Devnet:
- Solana Explorer: https://explorer.solana.com?cluster=devnet
- Paste your mint address

### Mainnet:
- Phantom Wallet (install extension)
- Magic Eden: https://magiceden.io
- Tensor: https://tensor.trade

---

## 🎯 Complete Workflow Example

```bash
# 1. Setup (one time)
npm install
npm run setup

# 2. Get devnet SOL (FREE)
# Visit faucet.solana.com, paste wallet address

# 3. Check balance
npm run balance

# 4. Upload your GLB
npm run upload "../my-model.glb" "Cool 3D Art" "My first Solana NFT"

# 5. Mint NFT
npm run mint

# Done! Cost: ~$0.50 on devnet FREE
```

---

## 🔑 Key Differences: Solana vs EVM

| Feature | Base/Ethereum (EVM) | Solana |
|---------|-------------------|---------|
| **Smart Contract** | Write in Solidity, deploy yourself | Pre-built (Metaplex) |
| **Setup** | Deploy contract first ($20-30) | Just install SDK ($0) |
| **Minting** | Call your contract | Call Metaplex |
| **Cost per NFT** | $1-3 | $0.30 |
| **Speed** | 2-5 seconds | 0.4 seconds |
| **Wallet** | MetaMask | Phantom |
| **NFT Standard** | ERC721 | Metaplex Token Metadata |
| **Programming** | Solidity required | JavaScript only |

**Bottom line**: Solana is cheaper, faster, and easier (no Rust needed).

---

## 💡 Pro Tips

**Save money:**
- Test everything on devnet (FREE)
- Switch to mainnet only when ready
- Batch operations to save on fees

**Best practices:**
- Backup your wallet private key
- Never share SOLANA_PRIVATE_KEY
- Keep `.env` gitignored
- Test with small files first

**Troubleshooting:**
- "Insufficient SOL" → Visit faucet or buy more
- "Transaction failed" → Check RPC might be down, try again
- "Metadata not loading" → Wait 1-2 minutes for IPFS propagation

---

## 📚 Resources

- [Metaplex Docs](https://developers.metaplex.com)
- [Solana Cookbook](https://solanacookbook.com)
- [Solana Faucet](https://faucet.solana.com)
- [Phantom Wallet](https://phantom.app)
- [Magic Eden Marketplace](https://magiceden.io)

---

## 🎉 Success!

You can now mint 3D NFTs on Solana for pennies instead of dollars. Share your NFTs on Twitter with #SolanaNFT! 🟣

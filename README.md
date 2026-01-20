# glb-full-dapp
Convert 3D GLB models into NFTs on the blockchain. Upload to IPFS via Pinata, create metadata, and mint to an ERC721 contract on Base Sepolia testnet.
## Features

✅ Upload 3D GLB models to Pinata IPFS  
✅ Automatically generate NFT metadata JSON  
✅ Deploy ERC721 smart contract  
✅ Mint NFTs in one command  
✅ Full testnet support (Base Sepolia)  

## Prerequisites

- **Node.js** (v16+)
- **npm** or **pnpm**
- **MetaMask** wallet with Base Sepolia configured
- **Pinata account** (free tier available at https://pinata.cloud)
- **Base Sepolia testnet ETH** (free from faucet: https://www.basescan.org/faucets)

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd glb-dapp

# Install dependencies
npm install
# or
pnpm install
```

## Configuration

1. **Create `.env` file** from template:
   ```bash
   cp .env.example .env
   ```

2. **Get Pinata JWT:**
   - Go to https://pinata.cloud
   - Create API key with "Pinning" permission
   - Add `PINATA_JWT` to `.env`

3. **Setup blockchain:**
   - Add your private key to `PINATA_PRIVATE_KEY` in `.env`
   - Ensure you have Base Sepolia testnet ETH (get from faucet)

4. **Deploy contract:**
   - Go to https://remix.ethereum.org
   - Create new file `GLBToNFT.sol`
   - Copy code from [glb-to-nft.sol](glb-to-nft.sol)
   - Compile (Solidity 0.8.0+)
   - Deploy to Base Sepolia with your wallet address as parameter
   - Copy deployed address to `CONTRACT_ADDRESS` in `.env`

Mint an NFT in one command - uploads GLB, creates metadata, and mints:

```bash
npx tsx mint-nft-complete.ts "./path/to/model.glb" "NFT Name" 
```
## Verify Your NFT

1. **Block Explorer:**
   - https://sepolia.basescan.org/address/0x{YOUR_CONTRACT_ADDRESS}

2. **MetaMask:**
   - Open NFTs tab
   - Click "Import NFT"
   - Contract: Your deployed address
   - Token ID: 0 (or your token ID)

3. **IPFS Gateway:**
   - View metadata: https://gateway.pinata.cloud/ipfs/{CID}
   - View model: https://gateway.pinata.cloud/ipfs/{CID}

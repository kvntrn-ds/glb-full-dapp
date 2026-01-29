# GLB to NFT - Mint 3D Models as NFTs on Base Sepolia

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

## Usage

### Option 1: Complete Workflow (Recommended)

Mint an NFT in one command - uploads GLB, creates metadata, and mints:

```bash
npx tsx mint-nft-complete.ts "./path/to/model.glb" "NFT Name" "Description"
```

Example:
```bash
npx tsx mint-nft-complete.ts "./lowpoly car.glb" "Dragon NFT" "A majestic 3D dragon"
```

### Option 2: Step-by-Step

**Step 1: Upload GLB and metadata**
```bash
npx tsx compress-upload-mint.ts "./path/to/model.glb"
```
This outputs the metadata URL.

**Step 2: Mint with metadata URL**
```bash
npx tsx mint.ts "https://gateway.pinata.cloud/ipfs/Qm..."
```

## File Structure

```
glb-dapp/
├── glb-to-nft.sol                # ERC721 smart contract
├── mint-nft-complete.ts          # All-in-one minting (recommended)
├── compress-upload-mint.ts       # Upload GLB and metadata
├── mint.ts                       # Mint with metadata URL
├── deploy.ts                     # Deployment helper
├── package.json
├── tsconfig.json
├── .env.example                  # Configuration template
└── README.md
```

## Smart Contract

The `GLBToNFT` contract is an ERC721 token that stores 3D GLB models as NFTs.

**Key functions:**
- `mint(address recipient, string memory tokenURI)` - Mint NFT to recipient
- `getTotalTokens()` - Get total minted tokens
- `withdraw()` - Owner can withdraw funds

**Deployment:**
- Network: Base Sepolia (chain ID: 84532)
- RPC: https://sepolia.base.org
- Constructor parameter: Your wallet address (the owner)

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

## Environment Variables

```
PRIVATE_KEY          # Your wallet's private key
CONTRACT_ADDRESS     # Deployed ERC721 contract address
RECIPIENT_ADDRESS    # Wallet to receive the NFT
RPC_URL              # Base Sepolia RPC endpoint
PINATA_JWT           # Pinata API JWT token
PINATA_GATEWAY       # IPFS gateway URL (optional)
```

## Troubleshooting

**"Insufficient funds for gas"**
- Get Base Sepolia testnet ETH from https://www.basescan.org/faucets

**"contract.mint is not a function"**
- Verify `CONTRACT_ADDRESS` in `.env` is correct and deployed to Base Sepolia

**NFT not showing in MetaMask**
- Manually import: NFTs tab → Import NFT → enter contract address and token ID
- Refresh MetaMask

**"Authentication failed" on Pinata**
- Verify `PINATA_JWT` is valid and has "Pinning" permissions

## Resources

- [OpenZeppelin ERC721 Docs](https://docs.openzeppelin.com/contracts/4.x/erc721)
- [Pinata IPFS Docs](https://docs.pinata.cloud)
- [Base Sepolia Docs](https://docs.base.org)
- [ethers.js Docs](https://docs.ethers.org/v6)

## License

MIT

## Support

For issues or questions, open a GitHub issue.

---

**Happy minting! 🎉**

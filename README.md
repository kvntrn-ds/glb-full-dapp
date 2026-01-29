# GLB to NFT - Mint 3D Models as NFTs on Base Sepolia

Convert 3D GLB models into NFTs on the blockchain. Upload to IPFS via Pinata, create metadata, and mint to an ERC721 contract on Base Sepolia testnet.

**Two ways to use:**
- 🖥️ **CLI Scripts** - Command-line tools for developers
- 🌐 **Web dApp** - User-friendly React interface with 3D preview

## Features

### CLI Tools
✅ Upload 3D GLB models to Pinata IPFS  
✅ Automatically generate NFT metadata JSON  
✅ Deploy ERC721 smart contract  
✅ Mint NFTs in one command  
✅ Full testnet support (Base Sepolia)

### Web dApp (NEW! 🎨)
✅ Interactive 3D model preview (React Three Fiber)  
✅ Drag & drop GLB file upload  
✅ Multi-wallet support (RainbowKit + wagmi)  
✅ Client-side IPFS upload  
✅ Real-time transaction tracking  
✅ Responsive modern UI (Tailwind CSS)  

## Prerequisites

- **Node.js** (v16+)
- **npm** or **pnpm**
- **MetaMask** wallet with Base Sepolia configured
- **Pinata account** (free tier available at https://pinata.cloud)
- **Base Sepolia testnet ETH** (free from faucet: https://www.basescan.org/faucets)

## Quick Start

### 🌐 Use the Web dApp (Easiest)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Pinata JWT, contract address, and WalletConnect ID

# Start development server
npm run dev
```

Visit http://localhost:3000 and connect your wallet!

### 🖥️ Use CLI Scripts

```bash
# In root directory
npm install

# Configure
cp .env.example .env
# Add your private key, contract address, Pinata JWT

# Mint an NFT
npx tsx mint-nft-complete.ts "./model.glb" "NFT Name" "Description"
```

## Configuration

1. **Create `.env` file** from template:
   ```bash
   c🌐 Web dApp (Recommended for Users)

1. **Connect Wallet** - Click "Connect Wallet" and select MetaMask
2. **Upload GLB File** - Drag & drop your .glb file
3. **Preview Model** - Interact with 3D preview (rotate, zoom)
4. **Add Metadata** - Enter NFT name and description
5. **Mint NFT** - Click mint and confirm in wallet
6. **Done!** - View on BaseScan or in your wallet

See [frontend/README.md](frontend/README.md) for detailed documentation.

### 🖥️ CLI Scripts (For Developers)

#### Option 1: Complete Workflow (Recommended)

Mint an NFT in one command - uploads GLB, creates metadata, and mints:

```bash
npx tsx mint-nft-complete.ts "./path/to/model.glb" "NFT Name" "Description"
```

Example:
```bash
npx tsx mint-nft-complete.ts "./lowpoly car.glb" "Dragon NFT" "A majestic 3D dragon"
```

#   - Go to https://remix.ethereum.org
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

###Project Structure

```
glb-dapp/
├── frontend/                     # React Web dApp
│   ├── src/
│   │   ├── components/          # UI components (FileUpload, ModelPreview, etc.)
│   │   ├── hooks/               # Custom React hooks (useIpfsUpload, useMintNFT)
│   │   ├── lib/                 # wagmi config, Pinata client
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md                # Frontend documentation
├── glb-to-nft.sol               # ERC721 smart contract
├── mint-nft-complete.ts         # CLI: All-in-one minting
├── compress-upload-mint.ts      # CLI: Upload GLB and metadata
├── mint.ts                      # CLI: Mint with metadata URL
├── deploy.ts                    # Deployment helper
├── test/                        # Smart contract tests
├── package.json
└── README.md                    # This file
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

### Root `.env` (for CLI scripts)
```
PRIVATE_KEY          # Your wallet's private key
CONTRACT_ADDRESS     # Deployed ERC721 contract address
RECIPIENT_ADDRESS    # Wallet to receive the NFT
RPC_URL              # Base Sepolia RPC endpoint
PINATA_JWT           # Pinata API JWT token
PINATA_GATEWAY       # IPFS gateway URL (optional)
```

### Frontend `.env` (for web dApp)
```
VITE_PINATA_JWT                # Same Pinata JWT (with VITE_ prefix)
VITE_CONTRACT_ADDRESS          # Same contract address
VITE_WALLETCONNECT_PROJECT_ID  # From https://cloud.walletconnect.com
VITE_PINATA_GATEWAY            # Optional custom gateway
1. **Block Explorer:**
   - https://sepolia.basescan.org/address/0x{YOUR_CONTRACT_ADDRESS}

2. **MetaMask:**
   - Open NFTs tab
   - Click "Import NFT"
   - Contract: Your deployed address
   - Token ID: 0 (or your token ID)
Tech Stack

### Frontend
- **React 18** - UI framework
- **wagmi 2.x** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **React Three Fiber** - 3D rendering engine
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

### Backend/CLI
- **TypeScript** - Type-safe scripting
- **ethers.js v6** - Blockchain interactions
- **Pinata SDK** - IPFS uploads
- **Hardhat** - Smart contract testing

### Smart Contract
- **Solidity 0.8.24** - Contract language
- **OpenZeppelin** - ERC721 implementation
- **Base Sepolia** - L2 testnet

## Deployment

### Deploy Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

Or use **Netlify**: drag `frontend/dist/` folder to https://app.netlify.com/drop

### Deploy Contract (Remix)
1. Go to https://remix.ethereum.org
2. Copy [glb-to-nft.sol](glb-to-nft.sol)
3. Compile with Solidity 0.8.0+
4. Deploy to Base Sepolia with your wallet as owner
5. Update `.env` files with contract address

## Resources

- [OpenZeppelin ERC721 Docs](https://docs.openzeppelin.com/contracts/4.x/erc721)
- [Pinata IPFS Docs](https://docs.pinata.cloud)
- [Base Sepolia Docs](https://docs.base.org)
- [wagmi Documentation](https://wagmi.sh)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

## Support

For issues or questions, open a GitHub issue or reach out on X/Twitter.

---

**Built with React, wagmi, and ❤️ on Base Sepolia**
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

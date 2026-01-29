# GLB to NFT - React Frontend

A modern React dApp for minting 3D GLB models as NFTs on Base Sepolia testnet.

## Features

- 🎨 **3D Model Preview** - Interactive Three.js viewer with orbit controls
- 🦊 **Wallet Integration** - RainbowKit + wagmi for seamless Web3 connection
- 📦 **Drag & Drop Upload** - Easy GLB file upload
- 🌐 **IPFS Storage** - Pinata integration for decentralized storage
- ⛓️ **Smart Contract** - Direct NFT minting on Base Sepolia
- 🎯 **Real-time Status** - Transaction tracking and status updates

## Tech Stack

- **React 18** - UI framework
- **wagmi 2.x** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **React Three Fiber** - 3D rendering
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_PINATA_JWT` - Your Pinata API JWT token
- `VITE_CONTRACT_ADDRESS` - Your deployed smart contract address
- `VITE_WALLETCONNECT_PROJECT_ID` - Get from https://cloud.walletconnect.com

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── WalletConnect.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ModelPreview.tsx
│   │   ├── MetadataForm.tsx
│   │   └── MintButton.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useIpfsUpload.ts
│   │   └── useMintNFT.ts
│   ├── lib/               # Configuration & utilities
│   │   ├── wagmi.ts       # wagmi/RainbowKit config
│   │   └── pinata.ts      # IPFS upload functions
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
└── package.json
```

## Usage

1. **Connect Wallet** - Click "Connect Wallet" button (MetaMask recommended)
2. **Upload GLB** - Drag & drop or click to select a .glb file
3. **Preview Model** - Interact with 3D preview (rotate, zoom)
4. **Add Metadata** - Enter NFT name and description
5. **Upload to IPFS** - Click "Continue to Mint"
6. **Mint NFT** - Confirm transaction in wallet
7. **Done!** - View on BaseScan and in your wallet

## Key Components

### WalletConnect
Uses RainbowKit's `ConnectButton` for wallet connection. Supports MetaMask, WalletConnect, Coinbase Wallet, etc.

### FileUpload
Drag-and-drop interface with `.glb` file validation. Shows file size and preview.

### ModelPreview
React Three Fiber canvas with:
- Orbit controls (drag to rotate, scroll to zoom)
- Environment lighting
- Auto-centering

### MetadataForm
Form for NFT name and description. Validates required fields.

### MintButton
Handles the complete mint flow:
- Upload GLB to IPFS
- Generate and upload metadata
- Call smart contract mint function
- Show transaction status

## Custom Hooks

### useIpfsUpload
Manages IPFS upload state and error handling. Uploads both GLB file and metadata JSON.

### useMintNFT
wagmi-based hook for smart contract interaction:
- Uses `useWriteContract` for mint transaction
- Uses `useWaitForTransactionReceipt` for confirmation
- Returns transaction status and hash

## Smart Contract Integration

The dApp interacts with your deployed `GLBToNFT.sol` contract via wagmi:

```typescript
// Contract ABI in lib/wagmi.ts
const CONTRACT_ABI = [
  {
    name: 'mint',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'tokenURI', type: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  }
];
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Deploy to:
- Vercel
- Netlify
- IPFS (via Fleek)
- Any static hosting

## Troubleshooting

### Wallet Not Connecting
- Ensure MetaMask is installed
- Check that Base Sepolia network is configured
- Verify WalletConnect Project ID is valid

### Upload Failing
- Verify PINATA_JWT is correct
- Check file size (max 100MB recommended)
- Ensure file is valid .glb format

### Mint Transaction Failing
- Check wallet has sufficient ETH for gas
- Verify contract address is correct
- Ensure you're on Base Sepolia network
- Check contract owner is your wallet address

### 3D Preview Not Loading
- Verify GLB file is valid (test in Blender/other viewer)
- Check browser console for Three.js errors
- Try with a simpler model first

## Development Tips

- Use React DevTools for component debugging
- Check Network tab for API calls
- MetaMask console shows transaction details
- BaseScan for transaction verification

## License

MIT

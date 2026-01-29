# AI Coding Assistant Instructions - GLB to NFT

## Project Overview
A blockchain-based NFT minting platform that uploads 3D GLB (glTF binary) models to IPFS via Pinata, generates NFT metadata, and mints ERC721 tokens on Base Sepolia testnet.

## Architecture & Data Flow

### Three-Layer Workflow
1. **IPFS Layer**: GLB files + metadata → Pinata → IPFS CIDs → Gateway URLs
2. **Smart Contract Layer**: ERC721 contract deployed on Base Sepolia, stores tokenURI pointing to IPFS metadata
3. **TypeScript Layer**: CLI scripts that orchestrate upload and minting via ethers.js v6

### Entry Points & Use Cases
- **`mint-nft-complete.ts`** (Recommended): Single command workflows — upload GLB + create metadata + mint. Used by end users.
- **`compress-upload-mint.ts`**: Upload-only path (GLB → IPFS), outputs metadata URL for separate minting step
- **`mint.ts`**: Minting-only path (takes metadata URL, calls contract). For advanced workflows.

## Critical Development Patterns

### Environment Variables (Always Required)
All scripts use `dotenv/config` auto-loading. Required .env keys:
```
PINATA_JWT=<your-pinata-jwt>
RPC_URL=https://sepolia.base.org  # Base Sepolia endpoint
PRIVATE_KEY=0x...                  # Deployer/minter wallet private key
CONTRACT_ADDRESS=0x...             # Deployed GLBToNFT contract address
RECIPIENT_ADDRESS=0x...            # Wallet to receive minted NFT
PINATA_GATEWAY=optional-gateway    # Defaults to pinata's public gateway
```

### Metadata Structure (Critical for NFT Display)
Wallets/explorers parse this JSON. See [compress-upload-mint.ts](../compress-upload-mint.ts#L75):
```json
{
  "name": "Dragon NFT",
  "description": "A 3D dragon model",
  "image": "https://gateway.pinata.cloud/ipfs/Qm...",
  "animation_url": "https://gateway.pinata.cloud/ipfs/Qm...",
  "attributes": [
    { "trait_type": "Format", "value": "GLB" },
    { "trait_type": "Size", "value": "2.5 MB" }
  ]
}
```
Both `image` and `animation_url` must point to the GLB gateway URL for 3D model rendering.

### PinataSDK Usage Pattern
- Initialize once per script with JWT
- `upload.public.file()` for both GLB and metadata JSON
- Always convert CID to gateway URL using `gateways.public.convert()` before storing in contract
- Return value: `{ cid, ... }` — extract `cid`, convert to gateway URL

### ethers.js v6 Pattern (Not v5)
- `ethers.JsonRpcProvider` for RPC connections (not `ethers.providers.JsonRpcProvider`)
- `ethers.Wallet` for signing
- `ethers.Contract` with minimal ABI (just function signatures as strings)
- `tx.wait()` returns receipt; always await for confirmation
- `ethers.formatEther()` for balance display

### Smart Contract Interaction
[glb-to-nft.sol](../glb-to-nft.sol) is a minimal OpenZeppelin ERC721 wrapper:
- `onlyOwner` modifier on `mint()` — only deployer can mint
- Counter-based token IDs (starts at 0, increments)
- `_setTokenURI()` stores metadata URL per token
- No built-in compression or validation — assumes valid GLB from Pinata

## Key Directories & Files
- Root TypeScript files: scripts to run manually or in CI
- [glb-to-nft.sol](../glb-to-nft.sol): Contract (deploy manually via Remix or programmatically)
- `.env`: Local configuration (git-ignored)
- `package.json`: Dependencies are pinata, ethers, dotenv (minimal)

## Common Workflows & Commands

### First-Time Setup
1. `npm install` → install dependencies
2. Deploy contract: Copy [glb-to-nft.sol](../glb-to-nft.sol) to Remix, compile, deploy to Base Sepolia
3. Configure `.env` with CONTRACT_ADDRESS and credentials
4. Test: `npx tsx mint-nft-complete.ts "./lowpoly car.glb" "Test NFT" "Test description"`

### Adding Features
- **GLB compression**: Hook into [compress-upload-mint.ts](../compress-upload-mint.ts#L35) before upload (use gltfpack, draco)
- **Batch minting**: Extend [mint-nft-complete.ts](../mint-nft-complete.ts) to accept file glob patterns
- **Metadata enrichment**: Extend the metadata object in any script; add traits, external_url, etc.
- **Contract upgrades**: Deploy new contract, update CONTRACT_ADDRESS in .env

### Debugging Tips
- Always check `.env` exists and has all required keys
- `ethers.formatEther()` wallet balance before minting (costs gas)
- Check Sepolia faucet for testnet ETH: https://www.basescan.org/faucets
- Verify Pinata JWT is valid (check at https://pinata.cloud)
- Transaction failures: check `tx.wait()` receipt for revert reason or gas issues

## TypeScript Configuration
- Target: ES2022, Module: ESNext
- ESM-only (`"type": "module"` in package.json)
- Use `fileURLToPath` + `import.meta.url` for `__dirname` in ESM context
- `forceConsistentCasingInFileNames: true` — case-sensitive file paths required

## Running Scripts & Tests

### CLI Scripts (TypeScript → IPFS → Blockchain)
- Run directly with `npx tsx <file.ts>` (no build step)
- TypeScript compiled on-the-fly by tsx
- Output: transaction hashes, IPFS URLs, token IDs to console
- Examples:
  ```bash
  npx tsx mint-nft-complete.ts "./model.glb" "NFT Name"
  npx tsx compress-upload-mint.ts "./model.glb"
  npx tsx mint.ts "https://gateway.pinata.cloud/ipfs/Qm..."
  ```

### Smart Contract Tests (Hardhat)
- Run with `npm test` → Hardhat Mocha test runner
- Tests in [test/](../test/) directory (CommonJS `.cjs` files + ethers.js v6)
- Hardhat config: [hardhat.config.cjs](../hardhat.config.cjs) with 60s Mocha timeout
- Deploy local Hardhat node, test contract logic, cleanup automatically
- Test examples: contract deployment, function calls, event emission, revert conditions

## Project-Specific Conventions
1. **Console logging**: Always use prefixed emojis (🚀, ⏳, ✅, ❌, 📁, 📝, 📄, 🔗) for user feedback
2. **Error handling**: Graceful error messages with process.exit(1)
3. **Command-line args**: `process.argv.slice(2)` for arguments; always validate and provide usage examples
4. **File I/O**: Resolve paths relative to `__dirname` (use `fileURLToPath` + `import.meta.url` in ESM context)
5. **Async/await**: All scripts are async main() IIFE pattern with error handling
6. **Smart contract tests**: CommonJS style with Chai assertions, Hardhat ethers helpers, Mocha hooks (beforeEach, it, describe)

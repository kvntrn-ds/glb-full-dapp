// mint.ts
import 'dotenv/config';
import { ethers } from 'ethers';

async function main() {
  // Get environment variables
  const rpcUrl = process.env.RPC_URL!;
  const privateKey = process.env.PRIVATE_KEY!;
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const recipientAddress = process.env.RECIPIENT_ADDRESS!;
  const metadataUrl = process.argv[2]; // Pass as command line argument

  if (!rpcUrl || !privateKey || !contractAddress || !recipientAddress) {
    throw new Error(
      'Missing RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, or RECIPIENT_ADDRESS in .env file'
    );
  }

  if (!metadataUrl) {
    throw new Error(
      'Usage: npx tsx mint.ts <metadata-url>\nExample: npx tsx mint.ts "https://gateway.pinata.cloud/ipfs/bafkreifv24po4r2wyzzvbjjiqygmhy7d6ql2jeycxtiye66z527m3wpvse"'
    );
  }

  console.log('Minting NFT...');
  console.log(`Contract: ${contractAddress}`);
  console.log(`Recipient: ${recipientAddress}`);
  console.log(`Metadata URL: ${metadataUrl}`);

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  console.log(`Minter address: ${signer.address}`);

  // Get account balance
  const balance = await provider.getBalance(signer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Contract ABI
  const abi = [
    'function mint(address recipient, string memory tokenURI) public returns (uint256)',
    'function getTotalTokens() public view returns (uint256)',
    'event NFTMinted(uint256 indexed tokenId, address indexed recipient, string tokenURI)',
  ];

  // Create contract instance
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    console.log('\nCalling mint function...');
    const tx = await contract.mint(recipientAddress, metadataUrl);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log('✅ NFT Minted successfully!');
    console.log(`Block number: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log(`Transaction URL: https://sepolia.basescan.org/tx/${tx.hash}`);

    // Try to get the new token count (may fail due to ABI issues)
    try {
      const totalTokens = await contract.getTotalTokens();
      console.log(`Total tokens minted: ${totalTokens.toString()}`);
    } catch (err) {
      console.log('Note: Could not fetch total tokens, but NFT was minted successfully!');
    }
  } catch (error: any) {
    console.error('Error minting NFT:', error.message);
    if (error.data) {
      console.error('Error data:', error.data);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

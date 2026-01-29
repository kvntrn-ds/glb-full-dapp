// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GLBToNFT
 * @dev An ERC721 contract for minting 3D GLB models as NFTs
 */
contract GLBToNFT is ERC721URIStorage, Ownable {
    uint256 private tokenCounter;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string tokenURI
    );

    constructor(address initialOwner) ERC721("GLB NFT", "GLB3D") Ownable(initialOwner) {
        tokenCounter = 0;
    }

    /**
     * @dev Mint a new NFT with a GLB model
     * @param recipient The address to receive the NFT
     * @param tokenURI The IPFS metadata URL (gateway URL)
     */
    function mint(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newTokenId = tokenCounter;
        tokenCounter += 1;

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(newTokenId, recipient, tokenURI);

        return newTokenId;
    }

    /**
     * @dev Get the total number of minted tokens
     */
    function getTotalTokens() public view returns (uint256) {
        return tokenCounter;
    }

    /**
     * @dev Allow the owner to withdraw any funds sent to this contract
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}

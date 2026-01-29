// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Compressor is Ownable {
    uint256 public maxInputSize = 1_200_000;        // ~1.2 MB
    uint256 public maxCompressedSize = 800_000;

    event GLBCompressed(
        address indexed minter,
        bytes32 indexed contentHash,
        uint256 originalSize,
        uint256 compressedSize,
        bytes compressedData
    );

    event CompressionFailed(
        address indexed caller,
        string reason,
        uint256 inputSize
    );

    constructor() Ownable(msg.sender) {}

    function compressGLB(bytes calldata glbData)
        external
        returns (bytes memory compressed, uint256 originalSize, uint256 compressedSize)
    {
        originalSize = glbData.length;

        if (originalSize == 0) {
            emit CompressionFailed(msg.sender, "Empty GLB", 0);
            revert("Empty GLB not allowed");
        }

        if (originalSize > maxInputSize) {
            emit CompressionFailed(msg.sender, "GLB too large", originalSize);
            revert("Input exceeds max size");
        }

        compressed = _simpleRLECompress(glbData);
        compressedSize = compressed.length;

        if (compressedSize > maxCompressedSize) {
            revert("Compressed result exceeds limit");
        }

        bytes32 contentHash = keccak256(compressed);

        // Emit full data if small, otherwise just hash
        if (compressedSize < 100_000) {
            emit GLBCompressed(msg.sender, contentHash, originalSize, compressedSize, compressed);
        } else {
            emit GLBCompressed(msg.sender, contentHash, originalSize, compressedSize, "");
        }

        return (compressed, originalSize, compressedSize);
    }

    function decompressGLB(bytes calldata compressed) external pure returns (bytes memory decompressed) {
        decompressed = _simpleRLEDecompress(compressed);
        return decompressed;
    }

    function _simpleRLECompress(bytes calldata data) internal pure returns (bytes memory) {
        if (data.length == 0) return new bytes(0);

        bytes memory result = new bytes(data.length * 2); // worst-case overestimate
        uint256 outIdx = 0;

        uint8 current = uint8(data[0]);
        uint256 runLength = 1;

        for (uint256 i = 1; i < data.length; ++i) {
            uint8 next = uint8(data[i]);
            if (next == current && runLength < 255) {
                runLength++;
            } else {
                if (runLength >= 4) {
                    result[outIdx++] = 0x00;
                    result[outIdx++] = bytes1(uint8(runLength));
                    result[outIdx++] = bytes1(current);
                } else {
                    for (uint256 j = 0; j < runLength; ++j) {
                        result[outIdx++] = bytes1(current);
                    }
                }
                current = next;
                runLength = 1;
            }
        }

        // Flush final run
        if (runLength >= 4) {
            result[outIdx++] = 0x00;
            result[outIdx++] = bytes1(uint8(runLength));
            result[outIdx++] = bytes1(current);
        } else {
            for (uint256 j = 0; j < runLength; ++j) {
                result[outIdx++] = bytes1(current);
            }
        }

        // Trim to actual size
        bytes memory trimmed = new bytes(outIdx);
        for (uint256 i = 0; i < outIdx; i++) {
            trimmed[i] = result[i];
        }
        return trimmed;
    }

    function _simpleRLEDecompress(bytes calldata compressed) internal pure returns (bytes memory) {
        if (compressed.length == 0) return new bytes(0);

        bytes memory result = new bytes(compressed.length * 10); // overestimate
        uint256 outIdx = 0;

        for (uint256 i = 0; i < compressed.length; ) {
            uint8 b = uint8(compressed[i]);

            if (b == 0x00 && i + 2 < compressed.length) {
                uint256 len = uint8(compressed[i + 1]);
                uint8 value = uint8(compressed[i + 2]);
                for (uint256 j = 0; j < len; ++j) {
                    result[outIdx++] = bytes1(value);
                }
                i += 3;
            } else {
                result[outIdx++] = compressed[i];
                ++i;
            }
        }

        // Trim
        bytes memory trimmed = new bytes(outIdx);
        for (uint256 i = 0; i < outIdx; i++) {
            trimmed[i] = result[i];
        }
        return trimmed;
    }

    function updateMaxSizes(uint256 newMaxInput, uint256 newMaxCompressed) external onlyOwner {
        require(newMaxInput >= 100_000 && newMaxCompressed >= 50_000, "Unreasonable limits");
        maxInputSize = newMaxInput;
        maxCompressedSize = newMaxCompressed;
    }
}
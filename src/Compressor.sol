// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {Compressor} from "src/Compressor.sol";

contract CompressorTest is Test {
    Compressor compressor;

    bytes sampleGLB;
    event GLBCompressed(
    address indexed minter,
    bytes32 indexed contentHash,
    uint256 originalSize,
    uint256 compressedSize,
    bytes compressedData
);

    function setUp() public {
        compressor = new Compressor();

        // Sample small GLB-like data (just dummy bytes for testing)
        sampleGLB = hex"00000000474c5446000000000000000000000000"; // fake GLB header-ish
    }

    function test_CompressDecompressRoundTrip() public {
        (bytes memory compressed, uint256 origSize, uint256 compSize) =
            compressor.compressGLB(sampleGLB);

        assertEq(origSize, sampleGLB.length, "Original size mismatch");
        assertEq(compSize, compressed.length, "Compressed size mismatch");

        bytes memory decompressed = compressor.decompressGLB(compressed);
        assertEq(decompressed, sampleGLB, "Round-trip failed: decompressed != original");
    }

    function testFuzz_CompressDecompress(bytes memory data) public {
        // Bound input size to avoid gas limit / memory issues in fuzzing
        vm.assume(data.length <= compressor.MAX_INPUT_SIZE);
        vm.assume(data.length > 0); // optional: avoid empty input

        (bytes memory compressed,,) = compressor.compressGLB(data);
        bytes memory decompressed = compressor.decompressGLB(compressed);

        assertEq(decompressed, data, "Fuzz round-trip failed");
    }
 

}
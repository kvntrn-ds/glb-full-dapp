const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Compressor", function () {
  let compressor, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Compressor = await ethers.getContractFactory("Compressor");
    compressor = await Compressor.deploy();
    await compressor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("sets the correct owner", async function () {
      expect(await compressor.owner()).to.equal(owner.address);
    });

    it("has correct initial constants", async function () {
      expect(await compressor.maxInputSize()).to.equal(1_200_000n);
      expect(await compressor.maxCompressedSize()).to.equal(800_000n);
    });
  });

  describe("compressGLB", function () {
    const sampleGLB = ethers.toUtf8Bytes(
      "mock GLB binary data with some repetitionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"
    );

    it("reverts on empty input", async function () {
      await expect(compressor.compressGLB("0x"))
        .to.be.revertedWith("Empty GLB not allowed");
    });

it("reverts on input larger than maxInputSize", async function () {
  this.timeout(60000); // 60 seconds – plenty for local node

  // Just 1 byte over – minimal construction time
  const tooBig = "0x" + "00".repeat(1200001);
  await expect(compressor.compressGLB(tooBig))
    .to.be.revertedWith("Input exceeds max size");
});

it("compresses valid data and round-trips decompress", async function () {
  const [compressed, originalSize, compressedSize] = await compressor.compressGLB.staticCall(sampleGLB);

  expect(originalSize).to.equal(BigInt(sampleGLB.length));
  expect(compressedSize).to.be.lte(BigInt(sampleGLB.length));

  const decompressed = await compressor.decompressGLB.staticCall(compressed);

  // Fix: compare both as hex strings
  expect(ethers.hexlify(decompressed)).to.equal(
    ethers.hexlify(sampleGLB),
    "round-trip failed"
  );
});

    it("compresses repetitive data noticeably", async function () {
      const repetitive = ethers.toUtf8Bytes("AAAA".repeat(200)); // 800 bytes
      const [compressed] = await compressor.compressGLB.staticCall(repetitive);

      expect(compressed.length).to.be.lt(repetitive.length * 0.9, "RLE should reduce size");
    });
  });

  describe("Access Control", function () {
    it("only owner can update max sizes", async function () {
      await expect(
        compressor.connect(user).updateMaxSizes(2000000, 1500000)
      ).to.be.revertedWithCustomError(compressor, "OwnableUnauthorizedAccount");

      await compressor.updateMaxSizes(2000000, 1500000);
      expect(await compressor.maxInputSize()).to.equal(2000000n);
      expect(await compressor.maxCompressedSize()).to.equal(1500000n);
    });
  });
});
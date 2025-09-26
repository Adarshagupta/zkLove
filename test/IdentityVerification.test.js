const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityVerification", function () {
  let identityVerification;
  let mockVerifier;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy MockVerifier
    const MockVerifier = await ethers.getContractFactory("MockVerifier");
    mockVerifier = await MockVerifier.deploy();
    await mockVerifier.deployed();

    // Deploy IdentityVerification
    const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
    identityVerification = await IdentityVerification.deploy(mockVerifier.address);
    await identityVerification.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct verifier address", async function () {
      expect(await identityVerification.verifier()).to.equal(mockVerifier.address);
    });

    it("Should initialize with zero verified users", async function () {
      expect(await identityVerification.totalVerifiedUsers()).to.equal(0);
    });

    it("Should revert with invalid verifier address", async function () {
      const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
      await expect(
        IdentityVerification.deploy(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid verifier address");
    });
  });

  describe("Proof Submission", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should submit a valid proof successfully", async function () {
      await expect(
        identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs)
      )
        .to.emit(identityVerification, "ProofSubmitted")
        .and.to.emit(identityVerification, "VerificationStatusChanged");

      expect(await identityVerification.isVerified(user1.address)).to.be.true;
      expect(await identityVerification.totalVerifiedUsers()).to.equal(1);
    });

    it("Should revert with empty proof", async function () {
      await expect(
        identityVerification.connect(user1).submitProof("0x", mockPublicInputs)
      ).to.be.revertedWith("Empty proof");
    });

    it("Should revert with no public inputs", async function () {
      await expect(
        identityVerification.connect(user1).submitProof(mockProof, [])
      ).to.be.revertedWith("No public inputs");
    });

    it("Should update existing verification", async function () {
      // First submission
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      expect(await identityVerification.totalVerifiedUsers()).to.equal(1);

      // Second submission (update)
      const newProof = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
      await identityVerification.connect(user1).submitProof(newProof, mockPublicInputs);
      
      // Should still have only 1 verified user (updated, not added)
      expect(await identityVerification.totalVerifiedUsers()).to.equal(1);
      expect(await identityVerification.isVerified(user1.address)).to.be.true;
    });
  });

  describe("Verification Status", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should return false for unverified user", async function () {
      expect(await identityVerification.isVerified(user1.address)).to.be.false;
    });

    it("Should return true for verified user", async function () {
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      expect(await identityVerification.isVerified(user1.address)).to.be.true;
    });

    it("Should return verification data correctly", async function () {
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      
      const [proofHash, timestamp, isValid, exists] = await identityVerification.getVerificationData(user1.address);
      
      expect(proofHash).to.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(timestamp).to.be.gt(0);
      expect(isValid).to.be.true;
      expect(exists).to.be.true;
    });
  });

  describe("Proof Hash Verification", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should verify existing proof hash", async function () {
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      
      const [proofHash] = await identityVerification.getVerificationData(user1.address);
      const isValid = await identityVerification.verifyProofHash(proofHash);
      
      expect(isValid).to.be.true;
    });

    it("Should return false for non-existent proof hash", async function () {
      const randomHash = "0x1111111111111111111111111111111111111111111111111111111111111111";
      const isValid = await identityVerification.verifyProofHash(randomHash);
      
      expect(isValid).to.be.false;
    });

    it("Should get user by proof hash", async function () {
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      
      const [proofHash] = await identityVerification.getVerificationData(user1.address);
      const userAddress = await identityVerification.getUserByProofHash(proofHash);
      
      expect(userAddress).to.equal(user1.address);
    });
  });

  describe("User Enumeration", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should return verified users with pagination", async function () {
      // Verify two users
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      await identityVerification.connect(user2).submitProof(mockProof, mockPublicInputs);

      const users = await identityVerification.getVerifiedUsers(0, 10);
      
      expect(users.length).to.equal(2);
      expect(users).to.include(user1.address);
      expect(users).to.include(user2.address);
    });

    it("Should handle pagination correctly", async function () {
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      await identityVerification.connect(user2).submitProof(mockProof, mockPublicInputs);

      // Get first user
      const firstPage = await identityVerification.getVerifiedUsers(0, 1);
      expect(firstPage.length).to.equal(1);

      // Get second user
      const secondPage = await identityVerification.getVerifiedUsers(1, 1);
      expect(secondPage.length).to.equal(1);

      // Ensure they're different
      expect(firstPage[0]).to.not.equal(secondPage[0]);
    });

    it("Should revert with out of bounds offset", async function () {
      await expect(
        identityVerification.getVerifiedUsers(10, 1)
      ).to.be.revertedWith("Offset out of bounds");
    });
  });

  describe("Verification Revocation", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should allow user to revoke their own verification", async function () {
      // First verify
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      expect(await identityVerification.isVerified(user1.address)).to.be.true;

      // Then revoke
      await expect(
        identityVerification.connect(user1).revokeVerification()
      ).to.emit(identityVerification, "VerificationStatusChanged");

      expect(await identityVerification.isVerified(user1.address)).to.be.false;
    });

    it("Should revert when revoking non-existent verification", async function () {
      await expect(
        identityVerification.connect(user1).revokeVerification()
      ).to.be.revertedWith("No verification to revoke");
    });

    it("Should allow emergency revocation", async function () {
      // First verify
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      expect(await identityVerification.isVerified(user1.address)).to.be.true;

      // Emergency revoke by another user (in real implementation, this would be restricted)
      await expect(
        identityVerification.connect(user2).emergencyRevoke(user1.address)
      ).to.emit(identityVerification, "VerificationStatusChanged");

      expect(await identityVerification.isVerified(user1.address)).to.be.false;
    });
  });

  describe("Statistics", function () {
    const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockPublicInputs = [123, 456, 789];

    it("Should return correct statistics", async function () {
      // Initially no users
      let [totalUsers, validVerifications] = await identityVerification.getStats();
      expect(totalUsers).to.equal(0);
      expect(validVerifications).to.equal(0);

      // Add one verified user
      await identityVerification.connect(user1).submitProof(mockProof, mockPublicInputs);
      [totalUsers, validVerifications] = await identityVerification.getStats();
      expect(totalUsers).to.equal(1);
      expect(validVerifications).to.equal(1);

      // Revoke verification
      await identityVerification.connect(user1).revokeVerification();
      [totalUsers, validVerifications] = await identityVerification.getStats();
      expect(totalUsers).to.equal(1); // Total users doesn't decrease
      expect(validVerifications).to.equal(0); // But valid verifications do
    });
  });

  describe("Proof Validity Check", function () {
    it("Should check proof validity without modifying state", async function () {
      const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const mockPublicInputs = [123, 456, 789];

      const isValid = await identityVerification.checkProofValidity(mockProof, mockPublicInputs);
      expect(isValid).to.be.true;

      // State should not have changed
      expect(await identityVerification.totalVerifiedUsers()).to.equal(0);
    });

    it("Should return false for empty proof", async function () {
      const isValid = await identityVerification.checkProofValidity("0x", [123]);
      expect(isValid).to.be.false;
    });

    it("Should return false for empty public inputs", async function () {
      const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const isValid = await identityVerification.checkProofValidity(mockProof, []);
      expect(isValid).to.be.false;
    });
  });
});

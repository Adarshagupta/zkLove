const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of Identity Verification contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy MockVerifier first
  console.log("\n1. Deploying MockVerifier...");
  const MockVerifier = await ethers.getContractFactory("MockVerifier");
  const mockVerifier = await MockVerifier.deploy();
  await mockVerifier.deployed();
  console.log("MockVerifier deployed to:", mockVerifier.address);

  // Deploy IdentityVerification contract
  console.log("\n2. Deploying IdentityVerification...");
  const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
  const identityVerification = await IdentityVerification.deploy(mockVerifier.address);
  await identityVerification.deployed();
  console.log("IdentityVerification deployed to:", identityVerification.address);

  // Verify deployment
  console.log("\n3. Verifying deployment...");
  const verifierAddress = await identityVerification.verifier();
  console.log("Verifier address in contract:", verifierAddress);
  console.log("Expected verifier address:", mockVerifier.address);
  
  if (verifierAddress === mockVerifier.address) {
    console.log("✅ Deployment verification successful!");
  } else {
    console.log("❌ Deployment verification failed!");
  }

  // Test basic functionality
  console.log("\n4. Testing basic functionality...");
  
  // Test proof verification (mock)
  const mockProof = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const mockPublicInputs = [123, 456, 789];
  
  try {
    const isValidProof = await identityVerification.checkProofValidity(mockProof, mockPublicInputs);
    console.log("Mock proof validity check:", isValidProof);
    
    // Get initial stats
    const [totalUsers, validVerifications] = await identityVerification.getStats();
    console.log("Initial stats - Total users:", totalUsers.toString(), "Valid verifications:", validVerifications.toString());
    
    console.log("✅ Basic functionality test passed!");
  } catch (error) {
    console.log("❌ Basic functionality test failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      MockVerifier: {
        address: mockVerifier.address,
        transactionHash: mockVerifier.deployTransaction.hash
      },
      IdentityVerification: {
        address: identityVerification.address,
        transactionHash: identityVerification.deployTransaction.hash
      }
    },
    deploymentTime: new Date().toISOString()
  };

  console.log("\n5. Deployment Summary:");
  console.log("=".repeat(50));
  console.log("Network:", deploymentInfo.network.name, `(Chain ID: ${deploymentInfo.network.chainId})`);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("MockVerifier:", deploymentInfo.contracts.MockVerifier.address);
  console.log("IdentityVerification:", deploymentInfo.contracts.IdentityVerification.address);
  console.log("Deployment Time:", deploymentInfo.deploymentTime);
  console.log("=".repeat(50));

  // Save to file for frontend use
  const fs = require('fs');
  const path = require('path');
  
  const deploymentPath = path.join(__dirname, '..', 'src', 'contracts', 'deployment.json');
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("Deployment info saved to:", deploymentPath);
  console.log("✅ Deployment completed successfully!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

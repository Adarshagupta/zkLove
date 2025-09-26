const hre = require("hardhat");

/**
 * Deploy script for zkLove smart contract
 * 
 * This script:
 * - Deploys the zkLove contract to the specified network
 * - Verifies the contract on Etherscan/Polygonscan
 * - Outputs deployment information for frontend integration
 */

async function main() {
  console.log("🚀 Starting zkLove contract deployment...");
  
  // Get the contract factory
  const zkLove = await hre.ethers.getContractFactory("zkLove");
  
  // Deploy the contract
  console.log("📦 Deploying zkLove contract...");
  const zkLoveContract = await zkLove.deploy();
  
  // Wait for deployment to complete
  await zkLoveContract.waitForDeployment();
  
  const contractAddress = await zkLoveContract.getAddress();
  console.log("✅ zkLove contract deployed to:", contractAddress);
  
  // Get deployment transaction details
  const deploymentTx = zkLoveContract.deploymentTransaction();
  console.log("📋 Deployment transaction hash:", deploymentTx.hash);
  console.log("⛽ Gas used:", deploymentTx.gasLimit.toString());
  
  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Deployed on network:", network.name, "(Chain ID:", network.chainId, ")");
  
  // Wait for a few confirmations before verification
  console.log("⏳ Waiting for confirmations...");
  await zkLoveContract.deploymentTransaction().wait(5);
  
  // Verify contract on Etherscan/Polygonscan (if not local network)
  if (network.chainId !== 31337n && process.env.ETHERSCAN_API_KEY) {
    console.log("🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }
  
  // Output deployment information for frontend
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    chainId: Number(network.chainId),
    deploymentTxHash: deploymentTx.hash,
    deploymentTimestamp: new Date().toISOString(),
    abi: zkLoveContract.interface.fragments.map(f => f.format('json')),
  };
  
  console.log("\n📄 Deployment Information:");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Transaction Hash:", deploymentInfo.deploymentTxHash);
  
  // Save deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentDir, `zkLove-${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);
  
  // TODO: Initialize contract with verification keys
  console.log("\n🔧 Contract initialization required:");
  console.log("- Upload Mopro circuit verification keys");
  console.log("- Set up IPFS for off-chain data storage");
  console.log("- Configure proof verification parameters");
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Update frontend config with contract address");
  console.log("2. Fund contract owner account for operations");
  console.log("3. Test contract functions on testnet");
  console.log("4. Set up monitoring and analytics");
  
  return contractAddress;
}

// Handle deployment errors
main()
  .then((address) => {
    console.log(`\n✅ Deployment successful: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

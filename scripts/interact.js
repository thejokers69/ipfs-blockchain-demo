const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Deployed contract address
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  
  // Attach contract using Hardhat's default signer
  const contract = await IPFSStorage.attach(contractAddress);
  
  // Set CID
  const tx = await contract.setCID("QmT5NvUtoM5nZHUW2pZXEjrScpRr4V6kgwYZin13uA5fXZ");
  await tx.wait();
  
  // Get CID
  const cid = await contract.getCID();
  console.log("Stored CID:", cid);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
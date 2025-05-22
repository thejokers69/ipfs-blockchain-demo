const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Update this with the address from the deployment script
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/IPFSStorage.sol/IPFSStorage.json"), "utf8"));
  const abi = artifact.abi;

  const [deployer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, abi, deployer);

  // Example: Upload new CIDs to the contract
  console.log("Setting a new file CID...");
  let tx = await contract.setCID("QmSuWZ3L6EyLr4uGiQX44vQ2NHwABEhxrAt5yTCxE6SoEN");
  await tx.wait();
  console.log("File CID set successfully!");

  console.log("Setting a new image CID...");
  tx = await contract.setImageCID("Qme56cWTYq2VFfJzQw6TPyQgS5ekkmEaDnaysPcXCSmY7t");
  await tx.wait();
  console.log("Image CID set successfully!");

  // Now retrieve and display the stored CIDs
  const fileCID = await contract.getCID();
  const imageCID = await contract.getImageCID();
  
  console.log("Current File CID:", fileCID);
  console.log("Current Image CID:", imageCID);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

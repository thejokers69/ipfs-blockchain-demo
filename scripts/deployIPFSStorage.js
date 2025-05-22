const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);

  const IPFSStorage = await hre.ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.waitForDeployment();

  const contractAddress = await ipfsStorage.getAddress();
  console.log("IPFSStorage déployé à :", contractAddress);

  let tx;

  // Set an example file CID
  tx = await ipfsStorage.setCID("QmfLKEvHV5HmVUoMfULuzwtP8rDZFXru7QQVv2VsrhUpgY");
  await tx.wait();
  console.log("FileCID ajouté !");

  // Set an example image CID
  tx = await ipfsStorage.setImageCID("QmaASbXRURpxgX96i34GFYXWUBqk7zptUTR4ozvA9xvPYA");
  await tx.wait();
  console.log("ImageCID ajouté !");

  // Read the values to confirm
  const fileCID = await ipfsStorage.getCID();
  const imageCID = await ipfsStorage.getImageCID();
  
  console.log("FileCID stocké :", fileCID);
  console.log("ImageCID stocké :", imageCID);
  
  console.log("Contract Address for frontend:", contractAddress);
  console.log("Remember to update the CONTRACT_ADDRESS value in frontend/src/App.jsx with this address");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

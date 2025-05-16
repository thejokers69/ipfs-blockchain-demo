const { ethers } = require("hardhat");
async function main() {
    const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
    const ipfsStorage = await IPFSStorage.deploy();
    await ipfsStorage.waitForDeployment();
    const address = await ipfsStorage.getAddress();
    console.log("Contract deployed to:", address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
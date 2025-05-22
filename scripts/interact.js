const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Update as needed
  const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/EventBooking.sol/EventBooking.json"), "utf8"));
  const abi = artifact.abi;

  const [deployer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, abi, deployer);

  // Example: Add a new event with a CID (owner-only)
  const tx = await contract.addEvent("Test Event", 10, "QmfLKEvHV5HmVUoMfULuzwtP8rDZFXru7QQVv2VsrhUpgY");
  await tx.wait();
  console.log("Event added with CID:", "QmfLKEvHV5HmVUoMfULuzwtP8rDZFXru7QQVv2VsrhUpgY");
  console.log("Event added with CID:", "QmaASbXRURpxgX96i34GFYXWUBqk7zptUTR4ozvA9xvPYA");
  console.log("Event added with CID:", "QmSuWZ3L6EyLr4uGiQX44vQ2NHwABEhxrAt5yTCxE6SoEN");
  console.log("Event added with CID:", "Qme56cWTYq2VFfJzQw6TPyQgS5ekkmEaDnaysPcXCSmY7t");

  // Retrieve event details
  const eventCount = await contract.getEventCount();
  for (let i = 0; i < eventCount; i++) {
    const [name, capacity, booked, imageCID] = await contract.getEvent(i);
    console.log(`Event ${i}: ${name}, Capacity: ${capacity}, Booked: ${booked}, Image CID: ${imageCID}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
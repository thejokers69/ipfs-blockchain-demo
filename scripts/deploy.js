const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);

  const EventBooking = await hre.ethers.getContractFactory("EventBooking");
  const eventBooking = await EventBooking.deploy();
  await eventBooking.waitForDeployment();

  console.log("EventBooking déployé à :", await eventBooking.getAddress());

  let tx;

  tx = await eventBooking.addEvent("Concert Web3", 5, "QmfLKEvHV5HmVUoMfULuzwtP8rDZFXru7QQVv2VsrhUpgY");
  await tx.wait();  // attendre confirmation

  tx = await eventBooking.addEvent("Conférence Blockchain", 50, "QmaASbXRURpxgX96i34GFYXWUBqk7zptUTR4ozvA9xvPYA");
  await tx.wait();

  tx = await eventBooking.addEvent("Atelier React", 30, "QmSuWZ3L6EyLr4uGiQX44vQ2NHwABEhxrAt5yTCxE6SoEN");
  await tx.wait();

  tx = await eventBooking.addEvent("Hackathon Web3", 100, "Qme56cWTYq2VFfJzQw6TPyQgS5ekkmEaDnaysPcXCSmY7t");
  await tx.wait();

  console.log("Événements ajoutés !");
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

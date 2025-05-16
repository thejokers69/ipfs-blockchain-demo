const { create } = require("ipfs-http-client");
const fs = require("fs");

async function upload() {
    const ipfs = create({ url: "http://localhost:5001" });
    const file = fs.readFileSync("fichier.txt"); // Ensure this file exists in the same directory
    const result = await ipfs.add(file);
    console.log("Fichier ajouté à IPFS !");
    console.log("CID :", result.path);
}

upload().catch(console.error);

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import contractABI from './contractABI.json';
// import './styles/global.css';
import { Buffer } from 'buffer';

// IPFS client configuration using local Docker node with CORS headers
const ipfs = create({
  url: 'http://localhost:5001/'
});

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  
  // State for file and image uploads
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // State for stored CIDs
  const [fileCID, setFileCID] = useState('');
  const [imageCID, setImageCID] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
        setContract(contractInstance);
        
        setMessage('Connected successfully!');
        
        // Fetch current CIDs after connecting
        fetchCIDs(contractInstance);
      } catch (error) {
        setMessage('Failed to connect: ' + error.message);
      }
    } else {
      setMessage('MetaMask is not installed');
    }
  };

  // Fetch CIDs from the contract
  const fetchCIDs = React.useCallback(async (contractInstance) => {
    try {
      const currentContract = contractInstance || contract;
      if (!currentContract) return;

      // Fetch file CID
      const fetchedFileCID = await currentContract.getCID();
      setFileCID(fetchedFileCID);
      
      // Fetch image CID
      const fetchedImageCID = await currentContract.getImageCID();
      setImageCID(fetchedImageCID);
      
      console.log('Fetched CIDs:', { fileCID: fetchedFileCID, imageCID: fetchedImageCID });
    } catch (error) {
      console.error('Error fetching CIDs:', error);
      setMessage('Error fetching CIDs: ' + error.message);
    }
  }, [contract]);

  // Upload file and set CID
  const uploadFile = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }
    
    if (!contract) {
      setMessage('Please connect your wallet first');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Upload to IPFS
          const buffer = Buffer.from(reader.result);
          const result = await ipfs.add(buffer);
          const cid = result.path;
          
          // Store CID in contract
          const tx = await contract.setCID(cid);
          await tx.wait();
          
          setMessage('File uploaded successfully! CID: ' + cid);
          setFileCID(cid);
          setFile(null);
        } catch (err) {
          console.error('Error uploading file:', err);
          setMessage('Error uploading file: ' + err.message);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage('Failed to upload file: ' + error.message);
    }
  };

  // Upload image and set CID
  const uploadImage = async () => {
    if (!imageFile) {
      setMessage('Please select an image first');
      return;
    }
    
    if (!contract) {
      setMessage('Please connect your wallet first');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Upload to IPFS
          const buffer = Buffer.from(reader.result);
          const result = await ipfs.add(buffer);
          const cid = result.path;
          
          // Store CID in contract
          const tx = await contract.setImageCID(cid);
          await tx.wait();
          
          setMessage('Image uploaded successfully! CID: ' + cid);
          setImageCID(cid);
          setImageFile(null);
        } catch (err) {
          console.error('Error uploading image:', err);
          setMessage('Error uploading image: ' + err.message);
        }
      };
      
      reader.readAsArrayBuffer(imageFile);
    } catch (error) {
      setMessage('Failed to upload image: ' + error.message);
    }
  };

  // Fetch CIDs when contract changes
  useEffect(() => {
    if (contract) {
      fetchCIDs();
    }
  }, [contract, fetchCIDs]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">IPFS Storage DApp</h1>
      
      {!account ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-4">Connected: {account}</p>
      )}
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      {contract && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={uploadFile}
            >
              Upload File to IPFS
            </button>
            
            {fileCID && (
              <div className="mt-4">
                <h3 className="font-medium">Current File CID:</h3>
                <p className="break-all bg-gray-100 p-2 rounded">{fileCID}</p>
                <a 
                  href={`https://ipfs.io/ipfs/${fileCID}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View File on IPFS
                </a>
              </div>
            )}
          </div>
          
          {/* Image Upload Section */}
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mb-4"
            />
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              onClick={uploadImage}
            >
              Upload Image to IPFS
            </button>
            
            {imageCID && (
              <div className="mt-4">
                <h3 className="font-medium">Current Image CID:</h3>
                <p className="break-all bg-gray-100 p-2 rounded">{imageCID}</p>
                <div className="mt-2">
                  <img
                    src={`https://ipfs.io/ipfs/${imageCID}`}
                    alt="Stored Image"
                    className="max-w-full h-auto rounded border"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

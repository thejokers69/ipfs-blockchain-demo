import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import contractABI from './contractABI.json';
// import './styles/global.css';
import { Buffer } from 'buffer';

// IPFS client configuration (use Infura or local IPFS node)
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

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

        // Check if the connected account is the owner
        const owner = await contractInstance.owner();
        setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());

        setMessage('Connected successfully!');
      } catch (error) {
        setMessage('Failed to connect: ' + error.message);
      }
    } else {
      setMessage('MetaMask is not installed');
    }
  };

  // Fetch events from the contract
  const fetchEvents = async () => {
    if (!contract) return;
    try {
      // Debug the contract instance to ensure ABI is loaded correctly
      console.log('Contract ABI keys:', Object.keys(contract.interface.fragments));  // Check for missing methods
      const eventCountResult = await contract.getEventCount();
      console.log('Raw result from getEventCount:', eventCountResult);  // Log raw result
      const eventCount = Number(eventCountResult);  // Explicit conversion
      
      const eventList = [];
      for (let i = 0; i < eventCount; i++) {
        // Ensure getEvent is called correctly; add error handling
        try {
          const eventData = await contract.getEvent(i);
          const hasReserved = await contract.hasReserved(i, account);
          eventList.push({
            id: i,
            name: eventData[0],  // Access by index if ABI decoding fails
            capacity: Number(eventData[1]),
            booked: Number(eventData[2]),
            imageCID: eventData[3],
            hasReserved,
          });
        } catch (subError) {
          console.error(`Error fetching event ${i}:`, subError);
        }
      }
      setEvents(eventList);
    } catch (error) {
      console.error('Detailed error fetching events:', error);  // More detailed logging
      setMessage('Error fetching events: ' + error.message);
    }
  };

  // Reserve a spot for an event
  const reserveSpot = async (eventId) => {
    if (!contract) {
      setMessage('Please connect your wallet');
      return;
    }
    try {
      const tx = await contract.reserve(eventId);
      await tx.wait();
      setMessage('Reservation successful!');
      fetchEvents();
    } catch (error) {
      setMessage('Reservation failed: ' + error.message);
    }
  };

  // Add a new event with image
  const addEvent = async () => {
    if (!newEventName.trim() || !newEventCapacity || !imageFile) {
      setMessage('Please provide event name, capacity, and image');
      return;
    }
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const buffer = Buffer.from(reader.result);
        const result = await ipfs.add(buffer);
        const imageCID = result.path;

        const tx = await contract.addEvent(newEventName.trim(), newEventCapacity, imageCID);
        await tx.wait();

        setMessage('Event added successfully!');
        setNewEventName('');
        setNewEventCapacity('');
        setImageFile(null);
        fetchEvents();
      };
      reader.readAsArrayBuffer(imageFile);
    } catch (error) {
      setMessage('Failed to add event: ' + error.message);
    }
  };

  // Fetch events when contract or account changes
  useEffect(() => {
    fetchEvents();
  }, [contract, account,]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Event Booking DApp</h1>
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
      {isOwner && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
          <input
            type="text"
            placeholder="Event Name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newEventCapacity}
            onChange={(e) => setNewEventCapacity(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mb-2"
          />
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={addEvent}
          >
            Add Event
          </button>
        </div>
      )}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-500">
            <th className="border p-2">Image</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Remaining Spots</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="border p-2">
                {event.imageCID ? (
                  <img
                    src={`https://ipfs.io/ipfs/${event.imageCID}`}
                    alt={event.name}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="border p-2">{event.name}</td>
              <td className="border p-2">{event.capacity}</td>
              <td className="border p-2">{event.remaining}</td>
              <td className="border p-2">
                {event.remaining === 0 ? (
                  <span className="text-red-600">Complet</span>
                ) : event.hasReserved ? (
                  <span className="text-gray-600">Vous avez déjà réservé</span>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => reserveSpot(event.id)}
                  >
                    Réserver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

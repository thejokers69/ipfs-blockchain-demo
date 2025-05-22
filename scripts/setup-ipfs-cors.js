const fetch = require('node-fetch');

async function setupCORS() {
  try {
    // Configure API CORS
    const apiResponse = await fetch('http://localhost:5001/api/v0/config?arg=API.HTTPHeaders.Access-Control-Allow-Origin&arg=["*"]&bool=true', { method: 'POST' });
    
    // Configure Gateway CORS
    const gatewayResponse = await fetch('http://localhost:5001/api/v0/config?arg=Gateway.HTTPHeaders.Access-Control-Allow-Origin&arg=["*"]&bool=true', { method: 'POST' });
    
    // Configure Access-Control-Allow-Methods
    const methodsResponse = await fetch('http://localhost:5001/api/v0/config?arg=API.HTTPHeaders.Access-Control-Allow-Methods&arg=["PUT", "POST", "GET"]&bool=true', { method: 'POST' });
    
    // Configure Access-Control-Allow-Headers
    const headersResponse = await fetch('http://localhost:5001/api/v0/config?arg=API.HTTPHeaders.Access-Control-Allow-Headers&arg=["Authorization", "X-Requested-With", "Range", "User-Agent"]&bool=true', { method: 'POST' });

    // Restart IPFS daemon to apply changes
    const restartResponse = await fetch('http://localhost:5001/api/v0/shutdown', { method: 'POST' });
    
    console.log('CORS configuration applied successfully!');
    console.log('Note: You might need to restart your IPFS node manually if it does not automatically restart.');
    console.log('Run: docker restart ipfs-node');
  } catch (error) {
    console.error('Error setting up CORS:', error.message);
    console.log('Make sure your IPFS node is running.');
    console.log('If needed, manually update CORS settings with:');
    console.log('docker exec -it ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin \'["*"]\'');
    console.log('docker exec -it ipfs-node ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin \'["*"]\'');
    console.log('docker restart ipfs-node');
  }
}

setupCORS();

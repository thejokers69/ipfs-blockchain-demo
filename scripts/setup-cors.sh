#!/bin/bash
# Apply CORS settings to IPFS Docker container

echo "Setting CORS configurations for IPFS..."

# Set API CORS headers
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization", "X-Requested-With", "Range", "User-Agent"]'

# Set Gateway CORS headers
docker exec ipfs-node ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs-node ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'
docker exec ipfs-node ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Headers '["Authorization", "X-Requested-With", "Range", "User-Agent"]'

# Restart IPFS container
echo "Restarting IPFS node..."
docker restart ipfs-node

echo "CORS configuration complete. Your IPFS node should now accept requests from your frontend."

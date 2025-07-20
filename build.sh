#!/bin/bash

# This script is used by Vercel to build the application

# Install server dependencies
npm install

# Navigate to client directory
cd client

# Install client dependencies
npm install

# Build the client
npm run build

# Return to root directory
cd ..

echo "Build completed successfully!"
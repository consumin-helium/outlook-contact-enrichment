#!/bin/sh

# Clean up any existing dev certs
rm -rf /home/node/.office-addin-dev-certs/*

# Start the dev server
exec npm run dev-server
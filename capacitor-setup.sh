#!/bin/bash

# Use Node 20 (required for Supabase packages)
nvm install 20
nvm use 20
echo "Using Node:"
node -v
echo "Using NPM:"
npm -v

# Install dependencies
npm install

# Ensure Android platform exists
if [ ! -d "android" ]; then
  npx cap add android
fi

# Copy web assets & sync plugins
npx cap copy
npx cap sync android
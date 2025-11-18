#!/bin/bash

# Install only missing dependencies (if needed)
npm ci

# Build already happens in YAML, so skip it here

# Ensure Android platform exists
if [ ! -d "android" ]; then
  npx cap add android
fi

# Copy web assets & sync plugins
npx cap copy
npx cap sync android
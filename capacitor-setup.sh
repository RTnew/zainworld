#!/bin/bash

npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init "NPAT" "com.myNPAT.NPAT" --web-dir=dist
npm run build
npx cap add android
npx cap copy
npx cap sync
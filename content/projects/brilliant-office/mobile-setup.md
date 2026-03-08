---
title: Mobile App Setup
order: 5
description: Guide to setting up the Expo/React Native mobile application.
---

# Mobile App Setup

The Brilliant Office mobile application is built using **Expo SDK 54** and **React Native**, providing a cross-platform experience for Android and iOS.

## Prerequisites
- **Node.js**: v20+ 
- **Package Manager**: pnpm (recommended) or npm.
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli` (for builds)

## Installation Steps
1. Navigate to the mobile directory:
   ```bash
   cd brilliantoffice
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on the project requirements:
   ```env
   EXPO_PUBLIC_API_URL=https://backend.brilliantoffice.in
   ```

## Development Commands
- **Start Expo Go**: `pnpm start`
- **Launch Android**: `pnpm android`
- **Launch iOS**: `pnpm ios` (requires macOS)
- **Clear Cache**: `pnpm start --clear`

## Core Technologies
- **Routing**: Expo Router (File-based routing in `/app`)
- **State Management**: Zustand
- **Animations**: React Native Reanimated
- **UI Components**: custom components with native primitives
- **Network**: Axios

## Production Builds (EAS)
The project uses **Expo Application Services (EAS)** for distributed builds.

### Android (AAB)
1. Update version in `app.json`.
2. Run: `eas build -p android --profile production`
3. Download AAB from Expo dashboard and upload to Google Play Console.

### iOS (IPA)
1. Update version in `app.json`.
2. Run: `eas build -p ios --profile production`
3. Submit to App Store: `eas submit -p ios --profile production --path ./builds/App.ipa`

> [!IMPORTANT]
> Ensure you have the `.jks` keystore files and passwords before attempting a production Android build. Reference the `RELEASE_GUIDE.md` in the project root for detailed steps.

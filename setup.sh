#!/bin/bash

# Setup script for Motor app
# This script helps set up the development environment

echo "🚗 Motor App Setup"
echo "=================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Check for asset files
echo "🖼️  Checking for asset files..."
ASSETS_MISSING=0

if [ ! -f "assets/icon.png" ]; then
    echo "❌ Missing: assets/icon.png (1024x1024)"
    ASSETS_MISSING=1
fi

if [ ! -f "assets/splash.png" ]; then
    echo "❌ Missing: assets/splash.png (1242x2436)"
    ASSETS_MISSING=1
fi

if [ ! -f "assets/adaptive-icon.png" ]; then
    echo "❌ Missing: assets/adaptive-icon.png (1024x1024)"
    ASSETS_MISSING=1
fi

if [ ! -f "assets/favicon.png" ]; then
    echo "❌ Missing: assets/favicon.png (48x48)"
    ASSETS_MISSING=1
fi

if [ $ASSETS_MISSING -eq 1 ]; then
    echo ""
    echo "⚠️  Asset files are missing!"
    echo ""
    echo "You can create placeholder images using:"
    echo "  - https://placeholder.com"
    echo "  - https://via.placeholder.com"
    echo "  - https://dummyimage.com"
    echo ""
    echo "Or use image editing tools like:"
    echo "  - Figma (https://www.figma.com)"
    echo "  - Canva (https://www.canva.com)"
    echo "  - Photopea (https://www.photopea.com)"
    echo ""
    echo "Required sizes:"
    echo "  - icon.png: 1024x1024"
    echo "  - splash.png: 1242x2436"
    echo "  - adaptive-icon.png: 1024x1024"
    echo "  - favicon.png: 48x48"
    echo ""
    echo "Note: The app may not start without these assets."
else
    echo "✅ All asset files present"
fi

echo ""
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    echo "Please fix the errors above before running the app."
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm start"
echo ""
echo "Then press:"
echo "  - 'i' for iOS Simulator"
echo "  - 'a' for Android Emulator"
echo "  - or scan the QR code with Expo Go app"
echo ""

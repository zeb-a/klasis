#!/bin/bash

# Quick PocketBase Installation Script
# Installs PocketBase 0.23.0 to /usr/local/bin/

set -e

echo "Installing PocketBase 0.23.0..."

# Install unzip if not available
if ! command -v unzip &> /dev/null; then
    echo "Installing unzip..."
    apt-get update && apt-get install -y unzip
fi

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v0.23.0/pocketbase_0.23.0_darwin_amd64.zip"
    echo "Detected macOS"
else
    PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v0.23.0/pocketbase_0.23.0_linux_amd64.zip"
    echo "Detected Linux"
fi

# Download
echo "Downloading PocketBase..."
cd /tmp
wget -O pocketbase.zip "$PB_URL"

# Extract
echo "Extracting..."
unzip -o pocketbase.zip

# Make executable
chmod +x pocketbase

# Install to /usr/local/bin (try without sudo first, then with sudo)
echo "Installing to /usr/local/bin..."
if mv pocketbase /usr/local/bin/ 2>/dev/null; then
    echo "✓ PocketBase installed to /usr/local/bin/"
else
    sudo mv pocketbase /usr/local/bin/
    echo "✓ PocketBase installed to /usr/local/bin/ (with sudo)"
fi

# Cleanup
rm pocketbase.zip
cd - > /dev/null

echo "✓ PocketBase installed successfully!"
echo ""
echo "Version:"
pocketbase -v
echo ""

# Test PocketBase
echo "Testing PocketBase..."
pocketbase serve --help > /dev/null 2>&1 && echo "✓ PocketBase is working correctly!" || echo "⚠ PocketBase test failed"

echo ""
echo "You can now run: pocketbase serve"
echo "Or start it in dev mode: pocketbase serve --dev"
echo ""

# Create alias for easier use (optional)
if [ -f "$HOME/.zshrc" ]; then
    PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    PROFILE="$HOME/.bashrc"
else
    PROFILE=""
fi

if [ -n "$PROFILE" ] && ! grep -q "alias pb=" "$PROFILE"; then
    echo ""
    echo "Creating pb alias in $PROFILE"
    echo "alias pb='pocketbase'" >> "$PROFILE"
    echo "Added 'pb' alias for PocketBase"
    echo "Reload your shell or run: source $PROFILE"
fi


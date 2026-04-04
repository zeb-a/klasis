#!/bin/bash

# Install NVM (Node Version Manager)

set -e

echo "Installing NVM (Node Version Manager)..."

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

echo ""
echo "✓ NVM installed!"
echo ""

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js 20..."
nvm install 20
nvm use 20
nvm alias default 20

echo ""
echo "✓ Node.js installed!"
node -v
npm -v
echo ""

# Install npm packages if package.json exists
if [ -f "package.json" ]; then
    echo "Installing npm packages..."
    npm install --legacy-peer-deps
    echo ""
    echo "✓ npm packages installed!"
fi
echo ""

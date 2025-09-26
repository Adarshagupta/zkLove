#!/bin/bash

echo "🚀 Setting up ZK Identity Verification App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v) ✓"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v) ✓"

# Install main dependencies
print_status "Installing React Native dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install React Native dependencies"
    exit 1
fi

# Install Hardhat dependencies
print_status "Installing Hardhat dependencies..."
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @types/chai @types/mocha

if [ $? -ne 0 ]; then
    print_error "Failed to install Hardhat dependencies"
    exit 1
fi

# Install additional testing dependencies
print_status "Installing testing dependencies..."
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-environment-node ts-jest

if [ $? -ne 0 ]; then
    print_error "Failed to install testing dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please edit .env file with your configuration"
fi

# Check if iOS development is available (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v pod &> /dev/null; then
        print_status "Installing iOS dependencies..."
        cd ios && pod install && cd ..
        if [ $? -eq 0 ]; then
            print_status "iOS dependencies installed ✓"
        else
            print_warning "Failed to install iOS dependencies"
        fi
    else
        print_warning "CocoaPods not found. iOS development not available."
    fi
else
    print_warning "iOS development only available on macOS"
fi

# Check Android development environment
if command -v adb &> /dev/null; then
    print_status "Android development environment detected ✓"
else
    print_warning "Android SDK not found in PATH. Android development may not work."
fi

# Compile smart contracts
print_status "Compiling smart contracts..."
npx hardhat compile

if [ $? -eq 0 ]; then
    print_status "Smart contracts compiled successfully ✓"
else
    print_warning "Failed to compile smart contracts"
fi

# Run tests
print_status "Running tests..."
npm test -- --passWithNoTests

if [ $? -eq 0 ]; then
    print_status "Tests passed ✓"
else
    print_warning "Some tests failed"
fi

# Create necessary directories
print_status "Creating project directories..."
mkdir -p assets/circuits
mkdir -p src/contracts
mkdir -p coverage

print_status "Setup completed! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Add your ZK circuit files to assets/circuits/"
echo "3. Deploy smart contracts: npx hardhat run contracts/deploy.js --network localhost"
echo "4. Start the React Native app: npm run android or npm run ios"
echo ""
echo "For more information, see README.md"

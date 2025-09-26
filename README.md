# ZK Identity Verification App

A React Native application that provides secure, privacy-preserving identity verification using zero-knowledge proofs, face recognition, ID document verification, and blockchain technology.

## 🚀 Features

- **Face Verification**: Biometric face recognition with privacy-preserving technology
- **ID Document Verification**: Automated extraction and validation of government-issued IDs
- **Zero-Knowledge Proofs**: Generate and verify identity proofs without revealing personal data
- **Blockchain Integration**: Immutable verification records stored on Ethereum
- **Mopro Integration**: Mobile zero-knowledge proof generation using Mopro
- **Privacy-First**: Your personal information never leaves your device unencrypted

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │      Mopro      │    │    Ethereum     │
│      App        │◄──►│   ZK Proofs     │◄──►│  Smart Contract │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Face & ID      │    │   Circuit       │    │  Verification   │
│  Verification   │    │   Compilation   │    │    Storage      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)
- Hardhat (for smart contract development)
- Mopro SDK

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/zk-identity-verification.git
cd zk-identity-verification
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install iOS dependencies (iOS only)

```bash
cd ios && pod install && cd ..
```

### 4. Set up environment variables

```bash
cp env.example .env
# Edit .env with your configuration
```

### 5. Deploy smart contracts

```bash
# Install Hardhat dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat run contracts/deploy.js --network localhost

# Or deploy to testnet
npx hardhat run contracts/deploy.js --network goerli
```

### 6. Set up Mopro

```bash
# Download and set up Mopro SDK
# Follow Mopro documentation for your platform
# Place circuit files in assets/circuits/
```

## 🚀 Running the App

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Start Metro bundler

```bash
npm start
```

## 📱 Usage Flow

1. **Launch App**: Open the ZK Identity Verification app
2. **Face Verification**: Use the front camera to capture and verify your face
3. **ID Document Upload**: Take a photo or select an ID document from gallery
4. **Proof Generation**: The app generates a zero-knowledge proof of your identity
5. **Blockchain Submission**: Proof is submitted to the Ethereum smart contract
6. **Verification Complete**: Receive your verification certificate

## 🔧 Configuration

### Environment Variables

Key environment variables you need to configure:

- `PRIVATE_KEY`: Ethereum private key for contract deployment
- `INFURA_PROJECT_ID`: Infura project ID for Ethereum connectivity
- `MOPRO_CIRCUIT_PATH`: Path to your ZK circuit file
- `MOPRO_PROVING_KEY_PATH`: Path to proving key
- `MOPRO_VERIFICATION_KEY_PATH`: Path to verification key

### Smart Contract Configuration

Update the contract addresses in `src/services/Web3Service.ts` after deployment.

### Mopro Circuit

You'll need to create a ZK circuit for identity verification. Example circuit inputs:

```circom
pragma circom 2.0.0;

template IdentityVerification() {
    signal input face_hash;
    signal input id_hash;
    signal input timestamp;
    signal output verification_result;
    
    // Your verification logic here
    verification_result <== 1;
}

component main = IdentityVerification();
```

## 🧪 Testing

### Run unit tests

```bash
npm test
```

### Run contract tests

```bash
npx hardhat test
```

### Run E2E tests

```bash
npm run test:e2e
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── contracts/              # Smart contracts
├── circuits/               # ZK circuits (to be added)
├── assets/                 # Static assets
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
└── __tests__/              # Test files
```

## 🔐 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Biometric Data**: Face data is processed locally and never stored
- **Zero-Knowledge**: Personal information is never revealed in proofs
- **Smart Contract**: Audit contracts before mainnet deployment
- **API Keys**: Use environment variables for all API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mopro](https://github.com/zkmopro/mopro) - Mobile zero-knowledge proof generation
- [React Native](https://reactnative.dev/) - Mobile app framework
- [Ethereum](https://ethereum.org/) - Blockchain platform
- [Hardhat](https://hardhat.org/) - Ethereum development environment

## 📞 Support

For support, email support@zkidentity.com or join our [Discord](https://discord.gg/zkidentity).

## 🗺️ Roadmap

- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Enhanced biometric verification
- [ ] Decentralized identity standards (DID)
- [ ] Mobile SDK for third-party integration
- [ ] Advanced privacy features
- [ ] Multi-language support

## ⚠️ Disclaimer

This is a demonstration project. Before using in production:

1. Conduct thorough security audits
2. Test extensively on testnets
3. Implement proper key management
4. Follow regulatory compliance requirements
5. Consider privacy implications

## 🔗 Links

- [Documentation](https://docs.zkidentity.com)
- [Demo Video](https://youtube.com/watch?v=demo)
- [Whitepaper](https://zkidentity.com/whitepaper.pdf)
- [Website](https://zkidentity.com)

---

Built with ❤️ for a more private and secure digital identity future.

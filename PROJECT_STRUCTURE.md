# zkLove Project Structure

This document outlines the complete project structure for the zkLove privacy-first dating app.

## 📁 Root Directory
```
zklove/
├── README.md                 # Main project documentation
├── package.json             # Dependencies and scripts
├── .gitignore              # Git ignore patterns
├── env.example             # Environment variables template
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── App.js                  # Main React Native app component
├── index.js                # App entry point
├── app.json                # React Native app configuration
└── PROJECT_STRUCTURE.md    # This file
```

## 📱 Frontend (React Native)
```
src/
├── screens/                # Main app screens
│   ├── RegistrationScreen.js    # User registration with biometric capture
│   ├── ProfileScreen.js         # User profile and settings
│   ├── MatchScreen.js           # Privacy-preserving matching
│   ├── RevealScreen.js          # Selective identity disclosure
│   └── AuraScreen.js            # Aura points and achievements
└── components/             # Reusable UI components
    ├── SelfieCapture.js         # Biometric selfie capture
    └── WalletConnect.js         # Blockchain wallet integration
```

## 🔐 Mopro Integration
```
src/mopro/
├── registrationProof.js    # Registration ZK proof generation
├── matchProof.js          # Privacy-preserving matching proofs
└── unlockProof.js         # Selective disclosure unlock proofs
```

## ⛓️ Smart Contracts
```
contracts/
├── zkLove.sol             # Main smart contract
├── hardhat.config.js      # Hardhat configuration
└── scripts/
    └── deploy.js          # Contract deployment script
```

## 🎯 Key Features by File

### Registration Flow
- **RegistrationScreen.js**: UI for user onboarding
- **SelfieCapture.js**: Biometric data capture
- **registrationProof.js**: ZK proof generation
- **WalletConnect.js**: Blockchain connection
- **zkLove.sol**: On-chain registration

### Matching System
- **MatchScreen.js**: Anonymous matching interface
- **matchProof.js**: Privacy-preserving compatibility
- **zkLove.sol**: Decentralized match verification

### Identity Reveal
- **RevealScreen.js**: Selective disclosure controls
- **unlockProof.js**: Mutual consent verification
- **zkLove.sol**: On-chain reveal management

### Reputation System
- **AuraScreen.js**: Gamification and achievements
- **zkLove.sol**: Aura point economics

## 🔧 Development Workflow

### 1. Frontend Development
```bash
npm start                    # Start Metro bundler
npm run ios                  # Run on iOS simulator
npm run android             # Run on Android emulator
```

### 2. Smart Contract Development
```bash
npm run compile-contracts    # Compile Solidity contracts
npx hardhat node            # Start local blockchain
npm run deploy-contracts    # Deploy to local/testnet
```

### 3. Mopro Integration
- Set up circuit compilation environment
- Generate and test zero-knowledge proofs
- Integrate with mobile proof generation

## 📋 Implementation Status

### ✅ Completed (Skeleton)
- [x] React Native project structure
- [x] All screen components with navigation
- [x] Mopro integration placeholders
- [x] Smart contract with all functions
- [x] Wallet connection components
- [x] Project configuration files

### 🚧 Next Steps (Implementation)
1. **Camera Integration**: Implement actual selfie capture
2. **Mopro Setup**: Configure ZK circuit compilation
3. **Wallet Integration**: Connect real wallet providers
4. **Smart Contract**: Add actual proof verification
5. **Testing**: Comprehensive test coverage
6. **Deployment**: Testnet and mainnet deployment

## 🔒 Security Considerations

### Privacy-First Design
- Biometric data never leaves device
- Zero-knowledge proofs for all matching
- Selective disclosure for identity reveal
- Encrypted local storage for sensitive data

### Smart Contract Security
- Proof verification for all critical operations
- Access controls and permission management
- Aura point economics and anti-gaming measures
- Emergency pause and upgrade mechanisms

## 🛠️ Development Tools

### Required Tools
- **Node.js 16+**: JavaScript runtime
- **React Native CLI**: Mobile app framework
- **Hardhat**: Smart contract development
- **Mopro SDK**: Zero-knowledge proof generation

### Recommended Tools
- **VS Code**: Code editor with React Native extensions
- **Flipper**: React Native debugging
- **Remix**: Smart contract testing and deployment
- **MetaMask**: Wallet for testing

## 📚 Documentation

### For Developers
- **README.md**: Getting started guide
- **Smart Contract Comments**: Inline documentation
- **Component JSDoc**: Function documentation
- **TODO Comments**: Implementation guidance

### For Users
- **Privacy Policy**: Data handling practices
- **User Guide**: App usage instructions
- **FAQ**: Common questions and answers
- **Security Guide**: Best practices for users

---

This project structure provides a solid foundation for building zkLove as a privacy-first dating application with zero-knowledge proofs and blockchain integration.

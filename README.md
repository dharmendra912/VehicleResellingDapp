# Instruction to compile and deploy a contract

- Node.js (version 20 or higher)
- npm (Node Package Manager)

1. Navigate to Contracts directory.
   ```bash
   cd contracts
   ```

2. Install dependencies:

```bash
npm install
```

# Frontend Setup and Running Instructions

## Prerequisites

- Node.js (version 20 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend/hedera-dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the javascript utility:
   ```bash
   node compileAndDeploy.js <ContractName.sol>
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. The application will be available at:
   ```
   http://localhost:4200
   ```

## Available Scripts

- `npm start`: Starts the development server

## Notes

- The application uses Angular 19.2.0

# Resources

- https://hashscan.io/ (to verify transaction)
- https://portal.hedera.com/playground
- https://remix.ethereum.org/ (for testing contracts)
- https://www.rareskills.io/ (for learning)
- https://solidity-by-example (code references)
- https://app.pinata.cloud/ipfs/files

# Deployment

Deployed on Distributed storage: https://w3s.link/ipfs/bafybeib6mrn3k6427rro7b6jauuebgm7ngzk2cycjcuprzjljdzajsvkl4/

# Contracts:

VehicleLedger.sol - Contract ID: 0.0.5864405 - EVM Address: (0x0000000000000000000000000000000000597bd5)
UserProfile.sol - Contract ID: 0.0.5864437 - EVM Address: (0x0000000000000000000000000000000000597bf5)

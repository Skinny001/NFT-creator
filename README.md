# NFT Creator Platform

A modern, decentralized NFT minting platform built with Next.js, TypeScript, and The Graph Protocol. Create, mint, and showcase NFTs with automatic creator rewards and lightning-fast gallery queries.

![NFT Creator Platform](https://via.placeholder.com/800x400/6366f1/ffffff?text=NFT+Creator+Platform)

## 🚀 Features

- **🔗 Wallet Integration**: Connect multiple wallets using WalletConnect/Reown AppKit
- **🎨 NFT Minting**: Upload images to IPFS and mint NFTs on Arbitrum Sepolia
- **💰 Creator Rewards**: Automatic ERC20 token rewards for creators
- **🖼️ NFT Gallery**: Browse and discover all minted NFTs with GraphQL queries
- **⚡ The Graph Integration**: Lightning-fast NFT data indexing and retrieval
- **📱 Responsive Design**: Mobile-first design for all devices
- **🔄 Real-time Updates**: Live balance and transaction tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Web3**: Wagmi, WalletConnect, Reown AppKit
- **Blockchain**: Arbitrum Sepolia Testnet
- **Smart Contracts**: Solidity, Foundry
- **Indexing**: The Graph Protocol
- **Storage**: IPFS via Pinata
- **GraphQL**: Apollo Client
- **Styling**: Tailwind CSS with responsive design

## 🌐 Live Deployment

- **Smart Contract**: [`0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8`](https://sepolia.arbiscan.io/address/0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8)
- **Network**: Arbitrum Sepolia Testnet
- **Block Explorer**: [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Web3 wallet (MetaMask, WalletConnect compatible)
- A Reown Cloud project ID
- A Pinata account for IPFS storage
- Arbitrum Sepolia testnet ETH

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd NFTCreatorPlatform/nft-frontend
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the `nft-frontend` directory:

```env
NEXT_PUBLIC_PROJECT_ID= your project id
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

### 3. Get Required API Keys

#### Reown Project ID
1. Visit [Reown Cloud](https://cloud.reown.com)
2. Create a new project
3. Copy your Project ID

#### Pinata JWT Token
1. Sign up at [Pinata](https://pinata.cloud)
2. Go to API Keys in your dashboard
3. Create a new key with upload permissions
4. Copy the JWT token (not the API key or secret)

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Smart Contract Details

The platform uses the NFT contract deployed on Arbitrum Sepolia:

```solidity
Contract Address: 0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8
Network: Arbitrum Sepolia (Chain ID: 421614)
Start Block: 184343121
```


## 🔍 Smart Contract Functions

The platform interacts with these key contract functions:

- `mintNFT(to, uri)`: Mint a new NFT with metadata
- `getCreatorTokenBalance(account)`: Get creator token balance
- `totalNFTsMinted()`: Get total NFTs minted
- `tokenURI(tokenId)`: Get NFT metadata URI
- `getCreator(tokenId)`: Get NFT creator address

## 📊 GraphQL Queries

The platform uses these GraphQL queries for fast data retrieval:

```graphql
# Get all minted NFTs
query GetNFTs {
  nftminteds(orderBy: blockTimestamp, orderDirection: desc) {
    id
    tokenId
    creator
    minter
    tokenURI
    blockTimestamp
    transactionHash
  }
}

# Get creator rewards
query GetCreatorRewards {
  creatorRewardeds(orderBy: blockTimestamp, orderDirection: desc) {
    id
    creator
    amount
    nftTokenId
    blockTimestamp
  }
}
```


## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contract (Already Deployed)

The smart contract is deployed on Arbitrum Sepolia at:
`0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8`


## 🔗 Links

- **Smart Contract**: [View on Arbiscan](https://sepolia.arbiscan.io/address/0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8)
- **Arbitrum Sepolia Faucet**: [Get Test ETH](https://faucet.quicknode.com/arbitrum/sepolia)



---

**Built by 0xskinny001 using Next.js, The Graph Protocol, and Arbitrum**

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Define Arbitrum Sepolia network
export const arbitrumSepolia = defineChain({
  id: 421614,
  caipNetworkId: 'eip155:421614',
  chainNamespace: 'eip155',
  name: 'Arbitrum Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://arbitrum-sepolia.infura.io/v3/a73c4abe541f41a3ba1b767a9cff4d00'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbitrum Sepolia Explorer',
      url: 'https://sepolia.arbiscan.io',
    },
  },
  testnet: true,
})

export const networks = [arbitrumSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
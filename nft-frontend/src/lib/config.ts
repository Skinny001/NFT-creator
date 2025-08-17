export const CONTRACT_ADDRESS = "0x27AfcC1b6C645acF64b67f19C98ed48641aC37A8"

export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "your-project-id"

export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || ""
export const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud"

export const CHAIN_CONFIG = {
  chainId: 421614, // Arbitrum Sepolia
  name: "Arbitrum Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.arbiscan.io",
  rpcUrl: "https://arbitrum-sepolia.infura.io/v3/a73c4abe541f41a3ba1b767a9cff4d00",
}

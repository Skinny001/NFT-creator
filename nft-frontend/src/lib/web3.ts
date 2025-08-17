// import { createAppKit } from "@reown/appkit/react"
// import { EthersAdapter } from "@reown/appkit-adapter-ethers"
// import { mainnet, arbitrum, polygon } from "@reown/appkit/networks"

// const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "your-project-id"

// const metadata = {
//   name: "NFT Creator Platform",
//   description: "Create and mint NFTs with creator rewards",
//   url: "https://your-domain.com",
//   icons: ["https://your-domain.com/icon.png"],
// }

// const ethersAdapter = new EthersAdapter()

// export const modal = createAppKit({
//   adapters: [ethersAdapter],
//   networks: [mainnet, arbitrum, polygon],
//   metadata,
//   projectId,
//   features: {
//     analytics: true,
//   },
// })


import { createAppKit } from "@reown/appkit/react"
import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { liskSepolia, mainnet } from "@reown/appkit/networks"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "your-project-id"

const metadata = {
  name: "NFT Creator Platform",
  description: "Create and mint NFTs with creator rewards",
  url: "https://your-domain.com",
  icons: ["https://your-domain.com/icon.png"],
}

const ethersAdapter = new EthersAdapter()

export const modal = createAppKit({
  adapters: [ethersAdapter],
  networks: [mainnet, liskSepolia],
  defaultNetwork: liskSepolia,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#3b82f6",
  },
})

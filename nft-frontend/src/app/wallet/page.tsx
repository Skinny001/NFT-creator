import { WalletConnect } from "@/components/wallet-connect"

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Wallet Connection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your MetaMask wallet to interact with the NFT contract. View your ETH balance and creator token
            rewards.
          </p>
        </div>

        <WalletConnect />
      </div>
    </div>
  )
}

import { MintNFTForm } from "@/components/mint-nft-form"

export default function MintPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Mint Your NFT</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your artwork, add metadata, and mint it as an NFT on the blockchain. You&apos;ll automatically receive
            creator tokens as rewards.
          </p>
        </div>

        <MintNFTForm />
      </div>
    </div>
  )
}
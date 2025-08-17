import { GraphQLNFTGallery } from "@/components/graphql-nft-gallery"

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 p-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          NFT Gallery
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore all NFTs minted on our platform, powered by The Graph Protocol for lightning-fast queries.
        </p>
      </div>

      <GraphQLNFTGallery />
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppKitProvider } from "@reown/appkit/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ExternalLink, RefreshCw, ImageIcon } from "lucide-react"
import { ethers } from "ethers"
import { NFTContract, NFTMetadata, type MintedNFT } from "@/lib/contract"
import { fetchMetadata, getIPFSUrl } from "@/lib/ipfs"

export function NFTGallery() {
  const { walletProvider } = useAppKitProvider("eip155")
  const [nfts, setNfts] = useState<MintedNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const fetchNFTs = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const provider = walletProvider
        ? new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider)
        : new ethers.JsonRpcProvider("https://eth.llamarpc.com")

      const contract = new NFTContract(provider)
      const mintedNFTs = await contract.getMintedNFTs()

      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        mintedNFTs.map(async (nft) => {
          try {
            const metadata = await fetchMetadata(nft.tokenURI)
            return { ...nft, metadata: metadata as NFTMetadata }
          } catch (err) {
            console.error(`Failed to fetch metadata for token ${nft.tokenId}:`, err)
            return nft
          }
        }),
      )

      setNfts(nftsWithMetadata.reverse()) // Show newest first
    } catch (err: unknown) {
      console.error("Error fetching NFTs:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to fetch NFTs")
      }
    } finally {
      setLoading(false)
    }
  }, [walletProvider])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading NFTs...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={fetchNFTs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT Gallery</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{nfts.length} NFTs</Badge>
          <Button variant="outline" size="sm" onClick={fetchNFTs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {nfts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">No NFTs found. Be the first to mint one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.tokenId} className="overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                {nft.metadata?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getIPFSUrl(nft.metadata.image) || "/placeholder.svg"}
                    alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=300"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{nft.metadata?.name || `NFT #${nft.tokenId}`}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {nft.metadata?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{nft.metadata.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Token ID:</span>
                    <span className="font-mono">#{nft.tokenId}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Creator:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{formatAddress(nft.creator)}</span>
                      <Button variant="ghost" size="sm" asChild className="h-4 w-4 p-0">
                        <a
                          href={`https://etherscan.io/address/${nft.creator}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Attributes:</span>
                    <div className="flex flex-wrap gap-1">
                      {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {attr.trait_type}: {attr.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useQuery } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ExternalLink, RefreshCw, ImageIcon } from "lucide-react"
import Image from "next/image"
import { GET_NFTS, type NFTMinted } from '@/lib/graphql'
import { fetchMetadata, getIPFSUrl } from "@/lib/ipfs"
import { useState, useEffect } from "react"

interface NFTWithMetadata extends NFTMinted {
  metadata?: {
    name?: string
    description?: string
    image?: string
    attributes?: Array<{ trait_type: string; value: string }>
  }
}

export function GraphQLNFTGallery() {
  const { data, loading, error, refetch } = useQuery(GET_NFTS, {
    variables: { first: 50 },
    pollInterval: 10000, // Poll every 10 seconds for new data
    errorPolicy: 'all', // Return partial data if available
    onError: (error) => {
      console.error('GraphQL Error:', error)
      console.error('Error details:', error.graphQLErrors)
      console.error('Network error:', error.networkError)
    },
    onCompleted: (data) => {
      console.log('GraphQL Data received:', data)
    }
  })

  const [nftsWithMetadata, setNftsWithMetadata] = useState<NFTWithMetadata[]>([])
  const [metadataLoading, setMetadataLoading] = useState(false)

  // Fetch metadata for NFTs
  useEffect(() => {
    if (data?.nftminteds) {
      setMetadataLoading(true)
      
      const fetchAllMetadata = async () => {
        const nftsWithMeta = await Promise.all(
          data.nftminteds.map(async (nft: NFTMinted) => {
            try {
              const metadata = await fetchMetadata(nft.tokenURI)
              return { ...nft, metadata }
            } catch (err) {
              console.error(`Failed to fetch metadata for token ${nft.tokenId}:`, err)
              return nft
            }
          })
        )
        setNftsWithMetadata(nftsWithMeta)
        setMetadataLoading(false)
      }

      fetchAllMetadata()
    }
  }, [data])
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

  if (loading || metadataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 p-6">
          <Card className="w-full bg-slate-900/80 backdrop-blur-xl border-purple-500/20 shadow-2xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                <span className="text-gray-200">
                  {loading ? "Loading NFTs from subgraph..." : "Fetching metadata..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Full error object:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 p-6">
          <Card className="w-full bg-slate-900/80 backdrop-blur-xl border-purple-500/20 shadow-2xl">
            <CardContent className="pt-6">
              <Alert className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-400/30">
                <AlertDescription className="space-y-4">
                  <div className="flex items-center justify-between text-red-200">
                    <div>
                      <p className="font-semibold">Error loading from subgraph:</p>
                      <p className="text-sm mt-2">{error.message}</p>
                      {error.graphQLErrors?.map((gqlError, index) => (
                        <p key={index} className="text-xs mt-1 opacity-80">
                          GraphQL: {gqlError.message}
                        </p>
                      ))}
                      {error.networkError && (
                        <p className="text-xs mt-1 opacity-80">
                          Network: {error.networkError.message}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()}
                      className="bg-slate-800/50 border-purple-500/30 text-gray-200 hover:bg-purple-600/20 hover:border-purple-400"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium">Troubleshooting:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                      <li>Check if the subgraph is still syncing</li>
                      <li>Visit the Graph Studio dashboard to see indexing status</li>
                      <li>Ensure the contract has been deployed and has events</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const nfts = nftsWithMetadata || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            NFT Gallery (Powered by The Graph)
          </h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white border-green-400/30 shadow-lg">
              ⚡ Subgraph
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-purple-400/30 shadow-lg">
              {nfts.length} NFTs
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-slate-800/50 border-purple-500/30 text-gray-200 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {nfts.length === 0 ? (
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/20 shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 p-6 rounded-full mb-6">
                <ImageIcon className="h-12 w-12 text-cyan-400" />
              </div>
              <p className="text-gray-300 text-center text-lg">No NFTs found in subgraph yet.</p>
              <p className="text-gray-500 text-center text-sm mt-2">Mint some NFTs to see them appear here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <Card 
                key={nft.id} 
                className="overflow-hidden bg-slate-900/80 backdrop-blur-xl border-purple-500/20 shadow-2xl hover:shadow-purple-500/25 hover:border-purple-400/40 transition-all duration-300 group"
              >
                <div className="aspect-square relative bg-gradient-to-br from-slate-800 to-purple-800/30 overflow-hidden">
                  {nft.metadata?.image ? (
                    <Image
                      src={getIPFSUrl(nft.metadata.image) || "/placeholder.svg"}
                      alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-cyan-400" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white group-hover:text-cyan-200 transition-colors">
                    {nft.metadata?.name || `NFT #${nft.tokenId}`}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {nft.metadata?.description && (
                    <p className="text-sm text-gray-300 line-clamp-2">{nft.metadata.description}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token ID:</span>
                      <span className="font-mono text-cyan-300">#{nft.tokenId}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Creator:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-purple-300">{formatAddress(nft.creator)}</span>
                        <Button variant="ghost" size="sm" asChild className="h-4 w-4 p-0">
                          <a
                            href={`https://sepolia.arbiscan.io/address/${nft.creator}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 text-cyan-400" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Minted:</span>
                      <span className="text-emerald-300 text-xs">{formatTimestamp(nft.blockTimestamp)}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      View Transaction <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

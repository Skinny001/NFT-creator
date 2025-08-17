import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, GalleryThumbnailsIcon as Gallery, Coins, Wallet, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-cyan-200 text-sm font-medium">Next Generation NFT Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Create & Mint NFTs
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Upload your digital art, mint unique NFTs, and earn creator rewards on the blockchain. 
              Join the future of digital ownership.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
              <Link href="/mint" className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Start Minting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-300">
              <Link href="/gallery" className="flex items-center gap-2">
                <Gallery className="h-5 w-5" />
                View Gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to create, mint, and manage your NFTs with built-in creator rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/30">
                <Wallet className="h-8 w-8 text-cyan-400" />
              </div>
              <CardTitle className="text-white text-xl">Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400 leading-relaxed">
                Connect your MetaMask wallet using Reown for secure blockchain interactions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                <Palette className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="text-white text-xl">NFT Minting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400 leading-relaxed">
                Upload images to IPFS and mint NFTs directly on the blockchain with metadata
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/30">
                <Coins className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-white text-xl">Creator Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400 leading-relaxed">
                Earn ERC20 creator tokens automatically when you mint NFTs and track your rewards
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-orange-500/30">
                <Gallery className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-white text-xl">NFT Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400 leading-relaxed">
                Browse all minted NFTs with metadata, creator information, and transaction details
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 border-slate-700 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  ∞
                </div>
                <div className="text-slate-400 text-lg font-medium">NFTs Created</div>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  🎨
                </div>
                <div className="text-slate-400 text-lg font-medium">Artists Supported</div>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full"></div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  💎
                </div>
                <div className="text-slate-400 text-lg font-medium">Creator Rewards</div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mt-3 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section - Uncommented and Enhanced */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
          <CardContent className="p-12">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Create?
                </h3>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Connect your wallet and start minting your first NFT today. Join thousands of creators earning rewards on our platform.
                </p>
              </div>
              {/* <Button asChild size="lg" className="w-full sm:w-auto text-lg px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
                <Link href="/wallet" className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Connect Wallet
                </Link>
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
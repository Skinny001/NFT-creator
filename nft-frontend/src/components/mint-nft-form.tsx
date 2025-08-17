"use client"

import type React from "react"

import { useState } from "react"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { ethers } from "ethers"
import { NFTContract, type NFTMetadata } from "@/lib/contract"
import { uploadToIPFS, uploadJSONToIPFS } from "@/lib/ipfs"

interface MintStep {
  id: number
  title: string
  completed: boolean
}

export function MintNFTForm() {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider("eip155")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  })

  const [minting, setMinting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")

  const steps: MintStep[] = [
    { id: 1, title: "Uploading image to IPFS", completed: false },
    { id: 2, title: "Creating metadata", completed: false },
    { id: 3, title: "Uploading metadata to IPFS", completed: false },
    { id: 4, title: "Minting NFT on blockchain", completed: false },
    { id: 5, title: "Transaction confirmed", completed: false },
  ]

//   // Ensure walletProvider is valid
// const walletProvider = window.ethereum;
// if (!walletProvider) {
//   throw new Error("No Ethereum provider found. Please install MetaMask.");
// }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image: null })
    setImagePreview("")
    setCurrentStep(0)
    setTransactionHash("")
    setError("")
    setMinting(false)
  }

  const handleMint = async () => {
    if (!isConnected || !address || !walletProvider) {
      setError("Please connect your wallet first")
      return
    }

    if (!formData.name || !formData.description || !formData.image) {
      setError("Please fill in all fields and select an image")
      return
    }

    setMinting(true)
    setError("")
    setCurrentStep(1)

    try {
      console.log("Starting mint process...")

      // Step 1: Upload image to IPFS
      console.log("Uploading image to IPFS...")
      const imageURI = await uploadToIPFS(formData.image)
      console.log("Image uploaded:", imageURI)
      setCurrentStep(2)

      // Step 2: Create metadata
      console.log("Creating metadata...")
      const metadata: NFTMetadata = {
        name: formData.name,
        description: formData.description,
        image: imageURI,
        attributes: [
          {
            trait_type: "Creator",
            value: address,
          },
          {
            trait_type: "Created",
            value: new Date().toISOString(),
          },
        ],
      }
      setCurrentStep(3)

      // Step 3: Upload metadata to IPFS
      console.log("Uploading metadata to IPFS...")
      const metadataURI = await uploadJSONToIPFS(metadata)
      console.log("Metadata uploaded:", metadataURI)
      setCurrentStep(4)

      // Step 4: Mint NFT
console.log("Connecting to blockchain...");
const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
const signer = await provider.getSigner();
console.log("Signer address:", await signer.getAddress());

const contract = new NFTContract(provider, signer);
console.log("Contract initialized, calling mintNFT...");

const txHash = await contract.mintNFT(address, metadataURI);
console.log("Transaction hash:", txHash);
setTransactionHash(txHash);
setCurrentStep(5);

      // Success!
      setTimeout(() => {
        resetForm()
      }, 5000)
    } catch (err: unknown) {
      console.error("Minting error:", err)

      // More specific error messages
      if (err && typeof err === 'object' && 'code' in err) {
        if (err.code === "ACTION_REJECTED") {
          setError("Transaction was rejected by user")
        } else if (err.code === "INSUFFICIENT_FUNDS") {
          setError("Insufficient funds for transaction")
        } else if ('message' in err && typeof err.message === 'string' && err.message.includes("user rejected")) {
          setError("Transaction was rejected by user")
        } else if ('message' in err && typeof err.message === 'string') {
          setError(err.message)
        } else {
          setError("Failed to mint NFT")
        }
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to mint NFT")
      }
      setMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 shadow-2xl">
        <CardContent className="pt-6">
          <Alert className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30 text-blue-200">
            <AlertDescription className="text-gray-200">Please connect your wallet to mint NFTs.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (minting) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/20">
          <CardTitle className="flex items-center gap-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Minting NFT...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                {index < currentStep - 1 ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : index === currentStep - 1 ? (
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-purple-400/50" />
                )}
                <span className={index < currentStep ? "text-emerald-300 font-medium" : "text-gray-400"}>{step.title}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <Progress value={(currentStep / steps.length) * 100} className="w-full h-3 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </Progress>
          </div>

          {transactionHash && (
            <Alert className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-400/30">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="flex items-center gap-2 text-emerald-200">
                NFT minted successfully!
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-cyan-300 hover:text-cyan-200">
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    View Transaction <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/20">
        <CardTitle className="flex items-center gap-2 text-white">
          <ImageIcon className="h-5 w-5 text-cyan-400" />
          Mint New NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {error && (
          <Alert className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-400/30">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200 font-medium">NFT Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter NFT name"
              className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200 font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your NFT"
              rows={3}
              className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-200 font-medium">Image</Label>
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 bg-gradient-to-br from-slate-800/30 to-purple-800/20 hover:border-cyan-400/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData({ ...formData, image: null })
                      setImagePreview("")
                    }}
                    className="w-full cursor-pointer bg-slate-800/50 border-purple-500/30 text-gray-200 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-cyan-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="mt-4 bg-slate-800/50 border-purple-500/30 text-gray-200 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleMint}
          disabled={!formData.name || !formData.description || !formData.image}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          Mint NFT
        </Button>
      </CardContent>
    </Card>
  )
}
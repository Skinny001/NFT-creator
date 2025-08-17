import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from "./config"
import contractABI from "./abi.json"

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface MintedNFT {
  tokenId: string
  creator: string
  minter: string
  tokenURI: string
  metadata?: NFTMetadata
}

export interface CreatorReward {
  creator: string
  amount: string
  nftTokenId: string
  transactionHash: string
  blockNumber: number
}

export class NFTContract {
  private contract: ethers.Contract
  private provider: ethers.Provider
  private signer?: ethers.Signer

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider
    this.signer = signer
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer || provider)
  }

  async mintNFT(to: string, tokenURI: string): Promise<string> {
    if (!this.signer) throw new Error("Signer required for minting")

    const tx = await this.contract.mintNFT(to, tokenURI)
    const receipt = await tx.wait()

    return receipt.hash
  }

  async getCreatorTokenBalance(address: string): Promise<string> {
    const balance = await this.contract.getCreatorTokenBalance(address)
    return ethers.formatEther(balance)
  }

  async getTotalNFTsMinted(): Promise<number> {
    const total = await this.contract.totalNFTsMinted()
    return Number(total)
  }

  async getNextTokenId(): Promise<number> {
    const nextId = await this.contract.getNextTokenId()
    return Number(nextId)
  }

  async getCreator(tokenId: string): Promise<string> {
    return await this.contract.getCreator(tokenId)
  }

  async tokenURI(tokenId: string): Promise<string> {
    return await this.contract.tokenURI(tokenId)
  }

  async getMintedNFTs(): Promise<MintedNFT[]> {
    const totalMinted = await this.getTotalNFTsMinted()
    const nfts: MintedNFT[] = []

    for (let i = 1; i <= totalMinted; i++) {
      try {
        const tokenURI = await this.tokenURI(i.toString())
        const creator = await this.getCreator(i.toString())

        nfts.push({
          tokenId: i.toString(),
          creator,
          minter: creator, // In this contract, creator and minter are the same
          tokenURI,
        })
      } catch (error) {
        console.error(`Error fetching NFT ${i}:`, error)
      }
    }

    return nfts
  }

  async getCreatorRewards(): Promise<CreatorReward[]> {
    const filter = this.contract.filters.CreatorRewarded()
    const events = await this.contract.queryFilter(filter)

    return events.map((event) => ({
      creator: "args" in event && event.args?.creator ? event.args.creator : "",
      amount: "args" in event && event.args?.amount ? ethers.formatEther(event.args.amount) : "0",
      nftTokenId: "args" in event && event.args?.nftTokenId ? event.args.nftTokenId.toString() : "",
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    }))
  }
}

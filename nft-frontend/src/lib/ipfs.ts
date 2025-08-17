import { PINATA_JWT, PINATA_GATEWAY } from "./config"

export interface IPFSUploadResult {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}



export async function uploadToIPFS(file: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured")
  }

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload to IPFS")
  }

  const result: IPFSUploadResult = await response.json()
  return `ipfs://${result.IpfsHash}`
}

export async function uploadJSONToIPFS(metadata: object): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured")
  }

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify(metadata),
  })

  if (!response.ok) {
    throw new Error("Failed to upload JSON to IPFS")
  }

  const result: IPFSUploadResult = await response.json()
  return `ipfs://${result.IpfsHash}`
}

export function getIPFSUrl(ipfsHash: string): string {
  if (ipfsHash.startsWith("ipfs://")) {
    return `${PINATA_GATEWAY}/ipfs/${ipfsHash.slice(7)}`
  }
  return `${PINATA_GATEWAY}/ipfs/${ipfsHash}`
}

export async function fetchMetadata(tokenURI: string): Promise<unknown> {
  try {
    const url = getIPFSUrl(tokenURI)
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch metadata")
    return await response.json()
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return null
  }
}
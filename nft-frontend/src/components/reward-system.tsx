"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, RefreshCw, ExternalLink, Coins, TrendingUp } from "lucide-react"
import { ethers } from "ethers"
import { NFTContract, type CreatorReward } from "@/lib/contract"

export function RewardSystem() {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider("eip155")
  const [rewards, setRewards] = useState<CreatorReward[]>([])
  const [totalRewards, setTotalRewards] = useState<string>("0")
  const [userBalance, setUserBalance] = useState<string>("0")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const fetchRewards = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const provider = walletProvider
        ? new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider)
        : new ethers.JsonRpcProvider("https://eth.llamarpc.com")

      const contract = new NFTContract(provider)

      // Fetch all creator rewards
      const allRewards = await contract.getCreatorRewards()
      setRewards(allRewards.reverse()) // Show newest first

      // Calculate total rewards
      const total = allRewards.reduce((sum, reward) => {
        return sum + Number.parseFloat(reward.amount)
      }, 0)
      setTotalRewards(total.toFixed(4))

      // Fetch user's creator token balance if connected
      if (isConnected && address) {
        const balance = await contract.getCreatorTokenBalance(address)
        setUserBalance(balance)
      }
    } catch (err: unknown) {
      console.error("Error fetching rewards:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch reward data"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [walletProvider, isConnected, address])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (blockNumber: number) => {
    // Approximate timestamp based on block number (rough estimate)
    // In a real app, you'd want to fetch the actual block timestamp
    return `Block #${blockNumber}`
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading reward data...</span>
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
              <Button variant="outline" size="sm" onClick={fetchRewards}>
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
        <h2 className="text-2xl font-bold">Creator Rewards</h2>
        <Button variant="outline" size="sm" onClick={fetchRewards}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards Distributed</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewards} CT</div>
            <p className="text-xs text-muted-foreground">Creator Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isConnected ? `${Number.parseFloat(userBalance).toFixed(2)} CT` : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Your creator tokens" : "Connect wallet to view"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Badge variant="secondary">{rewards.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.length}</div>
            <p className="text-xs text-muted-foreground">Reward events</p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rewards distributed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>NFT Token ID</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.slice(0, 10).map((reward, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{formatAddress(reward.creator)}</span>
                          <Button variant="ghost" size="sm" asChild className="h-4 w-4 p-0">
                            <a
                              href={`https://etherscan.io/address/${reward.creator}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{Number.parseFloat(reward.amount).toFixed(4)} CT</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">#{reward.nftTokenId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{formatDate(reward.blockNumber)}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                          <a
                            href={`https://etherscan.io/tx/${reward.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
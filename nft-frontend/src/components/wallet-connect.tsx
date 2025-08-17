"use client"

import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut, 
  User, 
  ChevronDown,
  Coins
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function WalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  })

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance)
    return num.toFixed(4)
  }

  const getExplorerUrl = (address: string) => {
    return `https://sepolia-blockscout.lisk.com/address/${address}`
  }

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
    toast.success("Wallet disconnected")
  }

  if (!isConnected || !address) {
    return (
      <Button 
        onClick={() => open()} 
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatAddress(address)}
              </span>
              <div className="flex items-center space-x-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  Connected
                </Badge>
                {caipNetwork && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                  >
                    {caipNetwork.name}
                  </Badge>
                )}
              </div>
            </div>
            
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 shadow-xl rounded-lg p-2"
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatAddress(address)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Coins className="h-3 w-3 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {balance ? `${formatBalance(balance.formatted)} ${balance.symbol}` : '0.0000 ETH'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuItem 
          onClick={copyAddress}
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
        >
          <Copy className="h-4 w-4 text-purple-600" />
          <span>Copy Address</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={getExplorerUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <span>View on Explorer</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => open()}
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <User className="h-4 w-4 text-gray-600" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem 
          onClick={handleDisconnect}
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors text-red-600 dark:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
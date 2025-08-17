"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Palette, GalleryThumbnailsIcon as Gallery, Coins, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { WalletConnect } from "@/components/wallet-connect"

const navigation = [
  { name: "Mint", href: "/mint", icon: Palette },
  { name: "Gallery", href: "/gallery", icon: Gallery },
  { name: "Rewards", href: "/rewards", icon: Coins },
  { name: "Wallet", href: "/wallet", icon: Wallet },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-200">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent sm:inline-block">
              NFT Creator
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20",
                  pathname === item.href 
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400",
                )}
              >
                {pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg" />
                )}
                <span className="relative">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-white dark:bg-gray-950">
            <Link 
              href="/" 
              className="flex items-center space-x-2 mb-6" 
              onClick={() => setOpen(false)}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NFT Creator
              </span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 text-sm font-medium transition-all duration-200 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20",
                      pathname === item.href 
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 px-3">
                <WalletConnect />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NFT Creator
              </span>
            </Link>
          </div>
          
          {/* Wallet Connect Button - Desktop */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}
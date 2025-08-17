// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/NFTCreatorPlatform.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the NFT Creator Platform
        NFTCreatorPlatform platform = new NFTCreatorPlatform();
        
        // Get the creator token address
        address creatorTokenAddress = platform.getCreatorTokenAddress();
        CreatorToken creatorToken = CreatorToken(creatorTokenAddress);
        
        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("NFTCreatorPlatform deployed to:", address(platform));
        console.log("CreatorToken deployed to:", creatorTokenAddress);
        console.log("Contract deployed by:", vm.addr(deployerPrivateKey));
        
        console.log("\n=== NFT CONTRACT INFO ===");
        console.log("NFT Name:", platform.name());
        console.log("NFT Symbol:", platform.symbol());
        console.log("Creator Reward per NFT:", platform.CREATOR_REWARD(), "tokens");
        
        console.log("\n=== ERC20 TOKEN INFO ===");
        console.log("Token Name:", creatorToken.name());
        console.log("Token Symbol:", creatorToken.symbol());
        console.log("Token Decimals:", creatorToken.decimals());
        console.log("Max Token Supply:", creatorToken.MAX_SUPPLY());
        console.log("Current Token Supply:", creatorToken.totalSupply());
        
        console.log("\n=== PLATFORM SETTINGS ===");
        console.log("Platform Owner:", platform.owner());
        
        vm.stopBroadcast();
    }
}
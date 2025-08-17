// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/NFTCreatorPlatform.sol";

contract NFTCreatorPlatformTest is Test {
    NFTCreatorPlatform public platform;
    CreatorToken public creatorToken;
    address public owner;
    address public creator;
    address public minter;
    
    string constant TEST_URI = "https://green-cheerful-boa-411.mypinata.cloud/ipfs/bafybeieqkwvbvw6u5krnlodukiczwc7ycyb3m4hvwjxcppuhc7k5ittcxi/0.json";
    uint256 constant CREATOR_REWARD = 100 * 10**18;
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed minter,
        string tokenURI
    );
    
    event CreatorRewarded(
        address indexed creator,
        uint256 amount,
        uint256 nftTokenId
    );

    function setUp() public {
        owner = address(this);
        creator = makeAddr("creator");
        minter = makeAddr("minter");
        
        platform = new NFTCreatorPlatform();
        creatorToken = CreatorToken(platform.getCreatorTokenAddress());
    }

    function testInitialState() public view {
        // NFT Contract
        assertEq(platform.name(), "ArtNFT");
        assertEq(platform.symbol(), "ART");
        assertEq(platform.getNextTokenId(), 1);
        assertEq(platform.totalNFTsMinted(), 0);
        assertEq(platform.owner(), owner);
        
        // Creator Token
        assertEq(creatorToken.name(), "CreatorToken");
        assertEq(creatorToken.symbol(), "CRT");
        assertEq(creatorToken.totalMinted(), 0);
        assertEq(creatorToken.totalSupply(), 0);
    }

    function testMintNFT() public {
        vm.prank(creator);
        
        // Expect CreatorRewarded event first (emitted by _rewardCreator)
        vm.expectEmit(true, true, false, true);
        emit CreatorRewarded(creator, CREATOR_REWARD, 1);
        
        // Expect NFTMinted event second (emitted after _rewardCreator)
        vm.expectEmit(true, true, true, true);
        emit NFTMinted(1, creator, minter, TEST_URI);
        
        uint256 tokenId = platform.mintNFT(minter, TEST_URI);
        
        assertEq(tokenId, 1);
        assertEq(platform.ownerOf(tokenId), minter);
        assertEq(platform.getCreator(tokenId), creator);
        assertEq(platform.tokenURI(tokenId), TEST_URI);
        assertEq(platform.getCreatorTokenBalance(creator), CREATOR_REWARD);
        assertEq(platform.getTotalCreatorTokens(), CREATOR_REWARD);
        assertEq(platform.getNextTokenId(), 2);
        assertEq(platform.totalNFTsMinted(), 1);
    }

    function testMintMultipleNFTs() public {
        // First NFT
        vm.prank(creator);
        platform.mintNFT(minter, TEST_URI);
        
        // Second NFT
        vm.prank(creator);
        platform.mintNFT(minter, "https://green-cheerful-boa-411.mypinata.cloud/ipfs/bafybeieqkwvbvw6u5krnlodukiczwc7ycyb3m4hvwjxcppuhc7k5ittcxi/1.json");
        
        assertEq(platform.getCreatorTokenBalance(creator), CREATOR_REWARD * 2);
        assertEq(platform.getTotalCreatorTokens(), CREATOR_REWARD * 2);
        assertEq(platform.totalNFTsMinted(), 2);
    }

    function testMintToSelf() public {
        vm.prank(creator);
        uint256 tokenId = platform.mintNFT(creator, TEST_URI);
        
        assertEq(platform.ownerOf(tokenId), creator);
        assertEq(platform.getCreator(tokenId), creator);
        assertEq(platform.getCreatorTokenBalance(creator), CREATOR_REWARD);
    }

    function testRewardCreatorByOwner() public {
        uint256 rewardAmount = 50 * 10**18;
        
        platform.rewardCreator(creator, rewardAmount);
        
        assertEq(platform.getCreatorTokenBalance(creator), rewardAmount);
        assertEq(platform.getTotalCreatorTokens(), rewardAmount);
    }

    function testRewardCreatorFailsForNonOwner() public {
        vm.prank(creator);
        vm.expectRevert();
        platform.rewardCreator(minter, 100 * 10**18);
    }

    function testMintNFTFailsWithEmptyURI() public {
        vm.prank(creator);
        vm.expectRevert("Token URI cannot be empty");
        platform.mintNFT(minter, "");
    }

    function testMintNFTFailsWithZeroAddress() public {
        vm.prank(creator);
        vm.expectRevert("Cannot mint to zero address");
        platform.mintNFT(address(0), TEST_URI);
    }

    function testRewardCreatorFailsWithZeroAddress() public {
        vm.expectRevert("Cannot reward zero address");
        platform.rewardCreator(address(0), 100 * 10**18);
    }

    function testGetCreatorFailsForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        platform.getCreator(999);
    }

    function testTokenURIFailsForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        platform.tokenURI(999);
    }

    function testCreatorTokenTransfer() public {
        // Mint NFT to get tokens
        vm.prank(creator);
        platform.mintNFT(minter, TEST_URI);
        
        // Transfer tokens
        vm.prank(creator);
        creatorToken.transfer(minter, 50 * 10**18);
        
        assertEq(creatorToken.balanceOf(creator), 50 * 10**18);
        assertEq(creatorToken.balanceOf(minter), 50 * 10**18);
    }

    function testCreatorTokenApproveAndTransferFrom() public {
        // Mint NFT to get tokens
        vm.prank(creator);
        platform.mintNFT(minter, TEST_URI);
        
        // Approve
        vm.prank(creator);
        creatorToken.approve(minter, 50 * 10**18);
        
        assertEq(creatorToken.allowance(creator, minter), 50 * 10**18);
        
        // Transfer from
        vm.prank(minter);
        creatorToken.transferFrom(creator, minter, 50 * 10**18);
        
        assertEq(creatorToken.balanceOf(creator), 50 * 10**18);
        assertEq(creatorToken.balanceOf(minter), 50 * 10**18);
        assertEq(creatorToken.allowance(creator, minter), 0);
    }

    function testNFTTransfer() public {
        // Mint NFT
        vm.prank(creator);
        uint256 tokenId = platform.mintNFT(minter, TEST_URI);
        
        // Transfer NFT
        vm.prank(minter);
        platform.transferFrom(minter, creator, tokenId);
        
        assertEq(platform.ownerOf(tokenId), creator);
        // Creator should still be the original creator
        assertEq(platform.getCreator(tokenId), creator);
    }

    function testNFTApproveAndTransferFrom() public {
        // Mint NFT
        vm.prank(creator);
        uint256 tokenId = platform.mintNFT(minter, TEST_URI);
        
        // Approve
        vm.prank(minter);
        platform.approve(creator, tokenId);
        
        assertEq(platform.getApproved(tokenId), creator);
        
        // Transfer from
        vm.prank(creator);
        platform.transferFrom(minter, creator, tokenId);
        
        assertEq(platform.ownerOf(tokenId), creator);
        assertEq(platform.getApproved(tokenId), address(0));
    }

    function testSupportsInterface() public view {
        // ERC721 interface
        assertTrue(platform.supportsInterface(0x80ac58cd));
        // ERC165 interface
        assertTrue(platform.supportsInterface(0x01ffc9a7));
    }

    function testMaxSupplyLimit() public {
        uint256 maxSupply = creatorToken.MAX_SUPPLY();
        assertEq(maxSupply, 1000000 * 10**18);
        
        // Test that minting beyond max supply fails - must be called by owner (platform)
        vm.expectRevert("Would exceed max supply");
        platform.rewardCreator(creator, maxSupply + 1);
    }

    function testCreatorTokenDirectMintFailsForNonOwner() public {
        vm.prank(creator);
        vm.expectRevert();
        creatorToken.mint(creator, 100 * 10**18);
    }

    function testMultipleCreators() public {
        address creator2 = makeAddr("creator2");
        
        // Creator 1 mints
        vm.prank(creator);
        platform.mintNFT(minter, TEST_URI);
        
        // Creator 2 mints
        vm.prank(creator2);
        platform.mintNFT(minter, "https://green-cheerful-boa-411.mypinata.cloud/ipfs/bafybeieqkwvbvw6u5krnlodukiczwc7ycyb3m4hvwjxcppuhc7k5ittcxi/2.json");
        
        assertEq(platform.getCreatorTokenBalance(creator), CREATOR_REWARD);
        assertEq(platform.getCreatorTokenBalance(creator2), CREATOR_REWARD);
        assertEq(platform.getTotalCreatorTokens(), CREATOR_REWARD * 2);
    }
}
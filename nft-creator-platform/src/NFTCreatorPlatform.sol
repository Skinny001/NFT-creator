// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorToken
 * @dev ERC20 token for rewarding creators
 */
contract CreatorToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1M max supply
    uint256 private _totalMinted;

    constructor() ERC20("CreatorToken", "CRT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(_totalMinted + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _totalMinted += amount;
        _mint(to, amount);
    }

    function totalMinted() external view returns (uint256) {
        return _totalMinted;
    }
}

/**
 * @title NFTCreatorPlatform
 * @dev ERC721 NFT contract that rewards creators with ERC20 tokens
 */
contract NFTCreatorPlatform is ERC721, Ownable {
    // Constants
    uint256 public constant CREATOR_REWARD = 100 * 10**18; // 100 tokens per mint
    
    // State variables
    CreatorToken public immutable creatorToken;
    uint256 private _nextTokenId = 1;
    
    // Mappings
    mapping(uint256 => address) public nftCreators;
    mapping(uint256 => string) private _tokenURIs;
    
    // Events
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

    constructor() ERC721("ArtNFT", "ART") Ownable(msg.sender) {
        creatorToken = new CreatorToken();
    }

    /**
     * @dev Mint an NFT and reward the creator
     * @param to Address to mint the NFT to
     * @param uri Metadata URI for the NFT
     */
    function mintNFT(address to, string memory uri) external returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(uri).length > 0, "Token URI cannot be empty");
        
        uint256 tokenId = _nextTokenId++;
        
        // Store creator and metadata
        nftCreators[tokenId] = msg.sender;
        _tokenURIs[tokenId] = uri;
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        // Reward creator with ERC20 tokens
        _rewardCreator(msg.sender, CREATOR_REWARD, tokenId);
        
        emit NFTMinted(tokenId, msg.sender, to, uri);
        
        return tokenId;
    }

    /**
     * @dev Internal function to reward creator with ERC20 tokens
     * @param creator Address of the creator to reward
     * @param amount Amount of tokens to mint as reward
     * @param nftTokenId The NFT token ID that triggered the reward
     */
    function _rewardCreator(address creator, uint256 amount, uint256 nftTokenId) internal {
        creatorToken.mint(creator, amount);
        emit CreatorRewarded(creator, amount, nftTokenId);
    }

    /**
     * @dev Public function to reward creator (only owner can call)
     * @param to Address to reward
     * @param amount Amount of tokens to mint
     */
    function rewardCreator(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot reward zero address");
        creatorToken.mint(to, amount);
    }

    /**
     * @dev Get the creator of a specific NFT
     * @param tokenId The NFT token ID
     * @return Address of the creator
     */
    function getCreator(uint256 tokenId) external view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return nftCreators[tokenId];
    }

    /**
     * @dev Get the metadata URI for a specific NFT
     * @param tokenId The NFT token ID
     * @return The metadata URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Get the next token ID that will be minted
     * @return The next token ID
     */
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get the total number of NFTs minted
     * @return Total NFTs minted
     */
    function totalNFTsMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @dev Get the CreatorToken contract address
     * @return Address of the CreatorToken contract
     */
    function getCreatorTokenAddress() external view returns (address) {
        return address(creatorToken);
    }

    /**
     * @dev Get creator token balance for an address
     * @param account Address to check balance for
     * @return Token balance
     */
    function getCreatorTokenBalance(address account) external view returns (uint256) {
        return creatorToken.balanceOf(account);
    }

    /**
     * @dev Get total creator tokens minted
     * @return Total tokens minted
     */
    function getTotalCreatorTokens() external view returns (uint256) {
        return creatorToken.totalMinted();
    }
}
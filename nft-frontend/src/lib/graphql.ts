import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// Your subgraph endpoint
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/118790/nft-creator-platform/v0.0.1'

export const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
})

// Simple test query to verify connection
export const TEST_QUERY = gql`
  query TestQuery {
    _meta {
      hasIndexingErrors
      block {
        number
        hash
      }
    }
  }
`

// GraphQL Queries - Try different entity naming conventions
export const GET_NFTS = gql`
  query GetNFTs($first: Int, $skip: Int) {
    nftminteds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      tokenId
      creator
      minter
      tokenURI
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

export const GET_CREATOR_REWARDS = gql`
  query GetCreatorRewards($first: Int, $skip: Int) {
    creatorRewardeds(
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      creator
      amount
      nftTokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

export const GET_CREATOR_STATS = gql`
  query GetCreatorStats($creator: Bytes!) {
    nftMinteds(where: { creator: $creator }) {
      id
      tokenId
      tokenURI
      blockTimestamp
    }
    creatorRewardeds(where: { creator: $creator }) {
      id
      amount
      blockTimestamp
    }
  }
`

// Test query to see all available entities
export const GET_ALL_ENTITIES = gql`
  query GetAllEntities {
    approvals(first: 5) {
      id
      owner
      approved
      tokenId
    }
    nftminteds(first: 5) {
      id
      tokenId
      creator
      minter
      tokenURI
    }
    creatorRewardeds(first: 5) {
      id
      creator
      amount
      nftTokenId
    }
  }
`

// Types for TypeScript
export interface NFTMinted {
  id: string
  tokenId: string
  creator: string
  minter: string
  tokenURI: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

export interface CreatorRewarded {
  id: string
  creator: string
  amount: string
  nftTokenId: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

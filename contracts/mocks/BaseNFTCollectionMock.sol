// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../BaseNFTCollection.sol";

/**
 * @title Base NFT Collection Mock
 */
contract BaseNFTCollectionMock is BaseNFTCollection {

    constructor(uint price_, string memory baseUrl_, uint maxTokens_, uint firstMintNumber, uint96 feeDenominator) BaseNFTCollection(price_, baseUrl_,maxTokens_, firstMintNumber, feeDenominator) ERC721("Base NFT", "BNFT") {}

}

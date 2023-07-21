// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../BaseNFTCollection.sol";

/**
 * @title Gas Usage Mock
 */
contract GasUsageMock is BaseNFTCollection {
    constructor(uint price_, string memory baseUrl_, uint maxTokens_, uint firstMintNumber, uint96 feeDenominator) BaseNFTCollection(price_, baseUrl_,maxTokens_, firstMintNumber, feeDenominator) ERC721("Base NFT", "BNFT") {}

    function teamMintOne() public {
        teamMint(1, msg.sender);
    }

    function teamMintTen() public {
        teamMint(10, msg.sender);
    }

    function teamMintHundred() public {
        teamMint(100, msg.sender);
    }

    function mintMultipleOne() public payable {
        mintMultiple(1);
    }

    function mintMultipleTwo() public payable {
        mintMultiple(2);
    }

    function mintMultipleFive() public payable {
        mintMultiple(5);
    }
}

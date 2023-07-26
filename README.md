[![Build][build-shield]][build-url]
[![Coverage][coverage-shield]][coverage-url]
[![Version][version-shield]][version-url]
[![GitHub issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![NPM][downloads-shield]][downloads-url]

# About

Base NFT collection contract written in Solidity. It includes Enumerable, Royalty, multiple minting, and team minting features.

It extends OpenZeppelin ERC721 implementation and can be used for NFT collections with consecutive token numbers.

# Features

- Public mint() and mintMultiple() functions
- teamMint() function that can be called only by the owner
- withdraw() function implementation
- Ability to update the base URI
- Ability to change the price
- Royalty implementation
- Light IERC721Enumerable implementation (Check caveats)
- Tokens start with 1 not 0

# Caveats

OpenZeppelin ERC721Enumerable implementation was not used because it doubles the gas usage for minting and transferring tokens. Instead, we opted for writing a simple implementation for tokenOfOwnerByIndex() by looping over all tokens, this makes tokenOfOwnerByIndex() very inefficient and can't be called from other contracts. The same idea is used in the Azuki contract.

**If you want to call tokenOfOwnerByIndex() from another contract, use OpenZeppelin ERC721Enumerable implementation instead.**

# Usage

```sh
npm install base-nft-contract
```

Once installed, write your contract and extend BaseNFTCollection:

```solidity
pragma solidity ^0.8.19;

import "base-nft-contract/contracts/BaseNFTCollection.sol";

contract MyNFTCollection is BaseNFTCollection {

    constructor(uint price_, string memory baseUrl_, uint maxTokens_, uint firstMintNumber, uint96 feeNumerator) BaseNFTCollection(price_, baseUrl_, maxTokens_, firstMintNumber, feeNumerator) ERC721("My NFT Collection", "MNC") {}

}
```

Make sure to update the class name, and your NFT collection name and symbol.

You can also create a contract with default parameters:

```solidity
pragma solidity ^0.8.19;

import "base-nft-contract/contracts/BaseNFTCollection.sol";

contract MyNFTCollection is BaseNFTCollection {

    constructor() BaseNFTCollection(10000000000000000, "https://yourbase.url/nft/", 5000, 40, 250) ERC721("My NFT Collection", "MNC") {}

}
```

Parameters:
- price_: Price of 1 NFT - ex: 10000000000000000 = 0.01 eth
- baseUrl_: Base URI for computing each token URI
- maxTokens_: Maximum number of tokens
- firstMintNumber: How many NFTs will be minted and transferred to the owner when deployed
- feeNumerator: Royalty fraction - ex: 250 = 2.5%

[downloads-shield]: https://img.shields.io/npm/dt/base-nft-contract?style=for-the-badge
[downloads-url]: https://www.npmjs.com/package/base-nft-contract

[issues-shield]: https://img.shields.io/github/issues/walks-of-life/base-nft-contract?style=for-the-badge
[issues-url]: https://github.com/walks-of-life/base-nft-contract/issues

[license-shield]: https://img.shields.io/badge/License-MIT-green?style=for-the-badge
[license-url]: https://github.com/walks-of-life/base-nft-contract/blob/main/LICENSE

[version-shield]: https://img.shields.io/npm/v/base-nft-contract?style=for-the-badge
[version-url]: https://www.npmjs.com/package/base-nft-contract

[build-shield]: https://img.shields.io/github/actions/workflow/status/walks-of-life/base-nft-contract/run_tests.yaml?style=for-the-badge
[build-url]: https://github.com/walks-of-life/base-nft-contract/actions/workflows/run_tests.yaml

[coverage-shield]: https://img.shields.io/codecov/c/github/walks-of-life/base-nft-contract?style=for-the-badge
[coverage-url]: https://app.codecov.io/gh/walks-of-life/base-nft-contract
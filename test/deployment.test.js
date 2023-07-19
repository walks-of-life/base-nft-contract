const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { originalPrice, baseURI, maxTokens, royalty, deployContractFixture } = require('./utils')

describe("Deployment", function () {

  it("Should set the correct price and maxTokens", async function () {
    const { contract } = await loadFixture(deployContractFixture)
    const price = await contract.price()
    expect(price).to.equal(originalPrice)
    const max = await contract.maxTokens()
    expect(max).to.equal(maxTokens)
    expect(await contract.totalSupply()).to.equal(0)
  });

  it("Should mint the correct number of tokens", async function () {
    const contractFactory = await ethers.getContractFactory("BaseNFTCollectionMock")
    const [owner] = await ethers.getSigners()
    const contract = await contractFactory.deploy(originalPrice, baseURI, maxTokens, 4, royalty)
    await contract.waitForDeployment()
    expect(await contract.balanceOf(owner.getAddress())).to.equal(4)
    expect(await contract.totalSupply()).to.equal(4)
  });
});

describe("Name", function () {
  it("Should return the right name", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.name()).to.equal("Base NFT");
  });

  it("Should return the right symbol", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.symbol()).to.equal("BNFT");
  });
});

describe("EIP-165 support", function () {

  it('Supports ERC165', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x01ffc9a7')).to.eq(true);
  });

  it('Supports IERC721', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x80ac58cd')).to.eq(true);
  });

  it('Supports ERC721Metadata', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x5b5e139f')).to.eq(true);
  });

  it('Supports ERC721Enumerable', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x780e9d63')).to.eq(true);
  });

  it('Supports ERC721Royalty', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x2a55205a')).to.eq(true);
  });

  it('Does not support random interface', async function () {
    const { contract } = await loadFixture(deployContractFixture);
    expect(await contract.supportsInterface('0x00000420')).to.eq(false);
  });
})
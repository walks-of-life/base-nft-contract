const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { originalPrice, deployContractFixture, maxTokens } = require('./utils')

describe("Minting", function () {

  it("Shouldn't allow minting without payment", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.mint()).to.be.reverted;
  });

  it("Shouldn't allow minting with the wrong price", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: ethers.parseEther("1") })).to.be.revertedWith('Incorrect price');
  });

  it("Should allow minting with the right price", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
  });

  it("Should allow multiple mints", async function () {
    const { contract, address1, address2 } = await loadFixture(deployContractFixture);
    const add1 = await address1.getAddress();
    const add2 = await address2.getAddress();
    expect(await contract.balanceOf(add1)).to.equal(0);
    expect(await contract.balanceOf(add2)).to.equal(0);
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.balanceOf(add1)).to.equal(1);
    expect(await contract.balanceOf(add2)).to.equal(0);
    expect(await contract.ownerOf("1")).to.equal(add1);
    await expect(contract.connect(address2).mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.ownerOf("1")).to.equal(add1);
    expect(await contract.ownerOf("2")).to.equal(add2);
    expect(await contract.totalSupply()).to.equal(2);
  });

  it("Shouldn't allow minting more than max tokens", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.teamMint(maxTokens - 1, address1.getAddress())).not.to.be.reverted;
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.mint({ value: originalPrice })).to.be.revertedWith('Maximum tokens reached');
  });
});
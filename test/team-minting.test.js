const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { maxTokens, deployContractFixture } = require('./utils')

describe("Team minting", function () {

  it("Shouldn't allow an address other than the owner to call teamMint", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.connect(address1).teamMint(3, address1.getAddress())).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Should mint the correct number of tokens to the correct address", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    const add1 = await address1.getAddress();
    expect(await contract.balanceOf(add1)).to.equal(0);
    await expect(contract.teamMint(3, address1.getAddress())).not.to.be.reverted;
    expect(await contract.balanceOf(add1)).to.equal(3);
    expect(await contract.ownerOf("1")).to.equal(add1);
    expect(await contract.ownerOf("2")).to.equal(add1);
    expect(await contract.ownerOf("3")).to.equal(add1);
    await expect(contract.ownerOf("4")).to.be.revertedWith('ERC721: invalid token ID');
  });

  it("Should be able to mint 1 token", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    const add1 = await address1.getAddress();
    expect(await contract.balanceOf(add1)).to.equal(0);
    await expect(contract.teamMint(1, address1.getAddress())).not.to.be.reverted;
    expect(await contract.balanceOf(add1)).to.equal(1);
    expect(await contract.ownerOf("1")).to.equal(add1);
    await expect(contract.ownerOf("2")).to.be.revertedWith('ERC721: invalid token ID');
  });

  it("Should allow multiple team minting actions", async function () {
    const { contract, address1, address2 } = await loadFixture(deployContractFixture);
    const add1 = await address1.getAddress();
    const add2 = await address2.getAddress();
    expect(await contract.balanceOf(add1)).to.equal(0);
    expect(await contract.balanceOf(add2)).to.equal(0);
    await expect(contract.teamMint(2, address1.getAddress())).not.to.be.reverted;
    await expect(contract.teamMint(3, address2.getAddress())).not.to.be.reverted;
    expect(await contract.balanceOf(add1)).to.equal(2);
    expect(await contract.balanceOf(add2)).to.equal(3);
    expect(await contract.ownerOf("1")).to.equal(add1);
    expect(await contract.ownerOf("4")).to.equal(add2);
    expect(await contract.totalSupply()).to.equal(5);
  });

  it("Shouldn't allow team minting more than the maximum number of tokens", async function () {
    const { contract, address1, address2 } = await loadFixture(deployContractFixture);
    const add1 = await address1.getAddress();
    await expect(contract.teamMint(maxTokens + 1, address1.getAddress())).to.be.revertedWith('Maximum tokens reached');
    expect(await contract.balanceOf(add1)).to.equal(0);
  });

})
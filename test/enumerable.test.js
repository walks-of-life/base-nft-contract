const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { deployContractFixture, originalPrice } = require('./utils')

describe("Enumberable", function () {

  it("Should return the correct totalSupply", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    const total = await contract.totalSupply();
    expect(total).to.equal(0);
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    const total2 = await contract.totalSupply();
    expect(total2).to.equal(2);
  });

  it("Should return the correct token index", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.teamMint(6, address1.getAddress())).not.to.be.reverted;
    expect(await contract.tokenByIndex(0)).to.equal(1);
    expect(await contract.tokenByIndex(1)).to.equal(2);
    expect(await contract.tokenByIndex(5)).to.equal(6);
    await expect(contract.tokenByIndex(6)).to.be.revertedWith('Index out of bounds');
  });

  it("Should return the correct owner token index", async function () {
    const { contract, owner, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.teamMint(3, address1.getAddress())).not.to.be.reverted;
    await expect(contract.teamMint(1, owner.getAddress())).not.to.be.reverted;
    await expect(contract.teamMint(1, address1.getAddress())).not.to.be.reverted;
    expect(await contract.tokenOfOwnerByIndex(address1.getAddress(), 0)).to.equal(1);
    expect(await contract.tokenOfOwnerByIndex(address1.getAddress(), 1)).to.equal(2);
    expect(await contract.tokenOfOwnerByIndex(address1.getAddress(), 2)).to.equal(3);
    expect(await contract.tokenOfOwnerByIndex(address1.getAddress(), 3)).to.equal(5);
    await expect(contract.tokenOfOwnerByIndex(address1.getAddress(), 4)).to.be.revertedWith('Owner index out of bounds');
    expect(await contract.tokenOfOwnerByIndex(owner.getAddress(), 0)).to.equal(4);
    await expect(contract.tokenOfOwnerByIndex(owner.getAddress(), 1)).to.be.revertedWith('Owner index out of bounds');
    
  });
})
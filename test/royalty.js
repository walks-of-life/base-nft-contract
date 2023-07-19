const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { originalPrice, deployContractFixture } = require('./utils')

describe("Royalty", function () {
  it("Shouldn't allow someone other than the owner to call change royalty function", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.connect(address1).changeRoyalty(address1.getAddress(), 300)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Should return the right royalty info", async function () {
    const { contract, owner } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    const [address, amount] = await contract.royaltyInfo(1, 1000)
    expect(address).to.be.equal(await owner.getAddress())
    expect(amount).to.be.equal(25)
  });

  it("Should return the right royalty info after changing it", async function () {
    const { contract, owner, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(owner).changeRoyalty(address1.getAddress(), 300)).not.to.be.reverted;

    const [address, amount] = await contract.royaltyInfo(1, 1000)
    expect(address).to.be.equal(await address1.getAddress())
    expect(amount).to.be.equal(30)
  });
})
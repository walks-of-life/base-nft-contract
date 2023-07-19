const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { originalPrice, baseURI, deployContractFixture, mintFirstToken } = require('./utils')

describe("Changing price", function () {
  it("Should allow owner to change the price", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    const newPrice = ethers.parseEther("0.01");
    await expect(contract.changePrice(newPrice)).not.to.be.reverted;
    expect(await contract.price()).to.equal(newPrice);
  });

  it("Shouldn't allow a different address to change the price", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    const newPrice = ethers.parseEther("0.01");
    await expect(contract.connect(address1).changePrice(newPrice)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Shouldn't allow minting with the old price", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    const newPrice = ethers.parseEther("0.01");
    await expect(contract.changePrice(newPrice)).not.to.be.reverted;
    await expect(contract.mint({ value: originalPrice })).to.be.revertedWith('Incorrect price');
  });

  it("Should allow minting with the new price", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    const newPrice = ethers.parseEther("0.01");
    await expect(contract.changePrice(newPrice)).not.to.be.reverted;
    await expect(contract.mint({ value: newPrice })).not.to.be.reverted;
  });
})

describe("Transfering token", function () {

  it("Should allow owner to transfer the token", async function () {
    const { contract, address1, address2 } = await loadFixture(mintFirstToken);
    const add1 = await address1.getAddress();
    const add2 = await address2.getAddress();
    await expect(contract.connect(address1).transferFrom(add1, add2, 1)).not.to.be.reverted;
    expect(await contract.ownerOf("1")).to.equal(add2);
  });

  it("Shouldn't allow other address to transfer the token", async function () {
    const { contract, address1, address2 } = await loadFixture(mintFirstToken);
    const add1 = await address1.getAddress();
    const add2 = await address2.getAddress();
    await expect(contract.connect(address2).transferFrom(add1, add2, 1)).to.be.reverted;
    expect(await contract.ownerOf("1")).to.equal(add1);
  });
})

describe("Withdraw", function () {

  it("Shouldn't allow someone other than the owner to call this function", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.connect(address1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Shouldn't allow withdrawing if balance is empty", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.withdraw()).to.be.revertedWith('Balance is empty');
  });

  it("Should allow withdrawing the full amount", async function () {
    const { contract, owner } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    await expect(() =>
      contract.withdraw()).to.changeEtherBalance(owner, ethers.parseEther("0.2"));
  });
})

describe("Renounce ownsership", function () {

  it("Shouldn't allow renouncing ownsership", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.renounceOwnership()).to.be.revertedWith('Renounce ownership not supported');
  });
})

describe("Base URI", function () {

  it("Shouldn't allow someone other than the owner to call this function", async function () {
    const { contract, address1 } = await loadFixture(deployContractFixture);
    await expect(contract.connect(address1).setBaseURI('http://localhost/')).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Should read the right baseURI from the deployment", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.tokenURI(1)).to.be.equal(baseURI + '1')
  });

  it("Should read the new baseURI after changing it", async function () {
    const { contract } = await loadFixture(deployContractFixture);
    await expect(contract.mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.tokenURI(1)).to.be.equal(baseURI + '1');
    await expect(contract.setBaseURI('http://localhost/')).not.to.be.reverted;
    expect(await contract.tokenURI(1)).to.be.equal('http://localhost/' + '1');
  });
})
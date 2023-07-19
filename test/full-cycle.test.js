const { expect } = require("chai");
const { baseURI} = require('./utils')

const originalPrice = ethers.parseEther("0.01");
const maxTokens = 12;
const firstMintNumber = 2;
const royalty = 250;

describe("Full Cycle", function () {

  it("Behaves correctly in a full cycle", async function () {
    const contractFactory = await ethers.getContractFactory("BaseNFTCollectionMock");
    const [owner, address1, address2, address3] = await ethers.getSigners();
    const contract = await contractFactory.deploy(originalPrice, baseURI, maxTokens, firstMintNumber, royalty);
    await contract.waitForDeployment();

    // Deployment
    expect(await contract.balanceOf(owner.getAddress())).to.equal(firstMintNumber);
    expect(await contract.totalSupply()).to.equal(2);

    // Minting
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.totalSupply()).to.equal(5);

    // Team minting
    await expect(contract.teamMint(2, address3.getAddress())).not.to.be.reverted;
    expect(await contract.totalSupply()).to.equal(7);


    // Minting
    await expect(contract.connect(address1).mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(address2).mint({ value: originalPrice })).not.to.be.reverted;
    await expect(contract.connect(address2).mint({ value: originalPrice })).not.to.be.reverted;
    expect(await contract.totalSupply()).to.equal(10);

    await expect(contract.teamMint(2, address3.getAddress())).not.to.be.reverted;
    expect(await contract.totalSupply()).to.equal(12);

    await expect(contract.connect(address2).mint({ value: originalPrice })).to.be.revertedWith('Maximum tokens reached');
    await expect(contract.teamMint(1, address3.getAddress())).to.be.revertedWith('Maximum tokens reached');
    expect(await contract.totalSupply()).to.equal(12);

    // Testing Balances
    expect(await contract.balanceOf(owner.getAddress())).to.equal(2);
    expect(await contract.balanceOf(address1.getAddress())).to.equal(4);
    expect(await contract.balanceOf(address2.getAddress())).to.equal(2);
    expect(await contract.balanceOf(address3.getAddress())).to.equal(4);

    // Withdrawing
    await expect(() => contract.withdraw()).to.changeEtherBalance(owner, ethers.parseEther("0.06"));
    
    // Transferring
    await expect(contract.connect(address1).transferFrom(address1.getAddress(), address2.getAddress(), 3)).not.to.be.reverted;
    expect(await contract.balanceOf(owner.getAddress())).to.equal(2);
    expect(await contract.balanceOf(address1.getAddress())).to.equal(3);
    expect(await contract.balanceOf(address2.getAddress())).to.equal(3);
    expect(await contract.balanceOf(address3.getAddress())).to.equal(4);
  });

})
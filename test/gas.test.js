const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { originalPrice, deployGasContractFixture } = require('./utils');

describe("Gas Usage", function () {

  it('runs mint 5 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 5; i++) {
      await contract.mint({ value: originalPrice })
    }
  });

  it('runs teamMintOne 5 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 5; i++) {
      await contract.teamMintOne()
    }
  });

  it('runs teamMintTen 3 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 3; i++) {
      await contract.teamMintTen()
    }
  });

  it('runs teamMintHundred 2 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 2; i++) {
      await contract.teamMintHundred()
    }
  });

  it('runs transferFrom 5 times', async function () {
    const { contract, owner, address1 } = await loadFixture(deployGasContractFixture);
    for (let i = 1; i < 6; i++) {
      await contract.transferFrom(owner.getAddress(), address1.getAddress(), i);
    }
  });

  it('runs safeTransferFrom 5 times', async function () {
    const { contract, owner, address1 } = await loadFixture(deployGasContractFixture);
    for (let i = 1; i < 6; i++) {
      await contract.safeTransferFrom(owner.getAddress(), address1.getAddress(), i);
    }
  });

  it('runs setApprovalForAll 5 times', async function () {
    const { contract, address1 } = await loadFixture(deployGasContractFixture);
    for (let i = 1; i < 6; i++) {
      await contract.setApprovalForAll(address1.getAddress(), true);
    }
  });

  it('runs mintMultipleOne 5 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 5; i++) {
      await contract.mintMultipleOne({ value: originalPrice })
    }
  });

  it('runs mintMultipleTwo 5 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 5; i++) {
      await contract.mintMultipleTwo({ value: originalPrice * BigInt(2) })
    }
  });

  it('runs mintMultipleFive 5 times', async function () {
    const { contract } = await loadFixture(deployGasContractFixture);
    for (let i = 0; i < 5; i++) {
      await contract.mintMultipleFive({ value: originalPrice * BigInt(5) })
    }
  });
})
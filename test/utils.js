const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const originalPrice = ethers.parseEther("0.1");
const baseURI = "https://localhost/base-nft/";
const maxTokens = 7;
const royalty = 250;

async function deployContractFixture() {
    const contractFactory = await ethers.getContractFactory("BaseNFTCollectionMock");
    const [owner, address1, address2] = await ethers.getSigners();
    const contract = await contractFactory.deploy(originalPrice, baseURI, maxTokens, 0, royalty);
    await contract.waitForDeployment();
    return { contractFactory, contract, owner, address1, address2 };
}

async function deployGasContractFixture() {
    const contractFactory = await ethers.getContractFactory("GasUsageMock");
    const [owner, address1, address2] = await ethers.getSigners();
    const contract = await contractFactory.deploy(originalPrice, baseURI, 5000, 40, royalty);
    await contract.waitForDeployment();
    return { contractFactory, contract, owner, address1, address2 };
}

async function mintFirstToken() {
    const { contract, address1, address2 } = await loadFixture(deployContractFixture);
    await contract.connect(address1).mint({ value: originalPrice });
    return { contract, address1, address2 };
}

module.exports = {
    originalPrice,
    baseURI,
    maxTokens,
    royalty,
    deployContractFixture,
    deployGasContractFixture,
    mintFirstToken
}
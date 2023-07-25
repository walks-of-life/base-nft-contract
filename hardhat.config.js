/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require("dotenv").config();
require("solidity-coverage");


module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true" ? true : false,
    currency: 'USD',
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
  }
};

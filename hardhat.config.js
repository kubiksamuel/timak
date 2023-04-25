require("dotenv").config()
require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    paths: {
        artifacts: "./src/artifacts",
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        mumbai: {
            url: "https://polygon-mumbai.g.alchemy.com/v2/gsXad78NI9j3rOfaTjVZGlS-R_PKXiYM",
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
    },
}

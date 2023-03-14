const hre = require("hardhat")

async function main() {
    const [deployer] = await hre.ethers.getSigners()

    console.log("Deploying contracts with the account:", deployer.address)
    const RepositoryFactory = await hre.ethers.getContractFactory("RepositoryFactory")
    const factory = await RepositoryFactory.deploy()

    await factory.deployed()

    console.log("Factory portal deployed to:", factory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

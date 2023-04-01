import { ethers } from "ethers"
import { acceptHMRUpdate, defineStore } from "pinia"
import contractABI from "../artifacts/contracts/RepositoryFactory.sol/RepositoryFactory.json"
import RepositoryABI from "../artifacts/contracts/Repository.sol/Repository.json"

import { RepositoryMeta } from "~/types/repository"

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"

export const useRepositoryStore = defineStore("user", {
    state: () => ({
        account: null as null | string,
        repositories: [],
    }),
    getters: {
        getAcccount: (state) => state.account,
        getRepositories: (state) => state.repositories,
    },
    actions: {
        logoutAccount() {
            this.account = null
        },
        async connectWallet() {
            try {
                const { ethereum } = window
                if (!ethereum) {
                    console.log("Must connect to MetaMask!")
                    return
                }
                const myAccounts = await ethereum.request({ method: "eth_requestAccounts" })
                console.log(myAccounts)
                console.log("Connected: ", myAccounts[0])
                this.account = myAccounts[0]

                const provider = new ethers.providers.Web3Provider(ethereum)
                // const signer = provider.getSigner()
                const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                // const rawRepositories = await repositoryFactoryContract.getUserRepos(this.account)

                const rawRepositories = await repositoryFactoryContract.getAllRepositories()
                console.log(rawRepositories)
                this.repositories = []
                for (const repository of rawRepositories) {
                    console.log("Repo address: ", repository)
                    const repositoryProxy = new ethers.Contract(repository, RepositoryABI.abi, provider)
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en-US").format(repoTime) as any
                    const description = await repositoryProxy.description()

                    // console.log("REPOSITORY NAME", name)
                    console.log("Repository data:", name, owner, repoTimeFormatted, description)
                    const repositoryData = {
                        name: repositoryProxy.name,
                        createdAt: repositoryProxy.createdAt,
                        owner: repositoryProxy.owner,
                        description: repositoryProxy.description,
                        versionHashes: repositoryProxy.versionHashes,
                        version: repositoryProxy.version,
                    }
                    this.repositories.push(repositoryData)
                }
                // console.log("Temp repos: ", this.getRepositories)
                // console.log("All repositories: ", this.getRepositories)
            } catch (error) {
                console.log(error)
            }
        },
        async createRepository(newRepository: RepositoryMeta) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                    /*
                     * Execute the actual wave from your smart contract
                     */
                    console.log("New repository creation data: ", newRepository)
                    const repositoryTxn = await repositoryFactoryContract.createRepositoryContract(newRepository.name, newRepository.description)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
    persist: true,
})

// if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

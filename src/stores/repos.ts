import {ethers} from "ethers"
import {defineStore} from "pinia"
import contractABI from "../artifacts/contracts/RepositoryFactory.sol/RepositoryFactory.json"
import RepositoryABI from "../artifacts/contracts/Repository.sol/Repository.json"

import {RepositoryMeta} from "~/types/repository"
import {getAddress} from "ethers/lib/utils";

const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

export const useRepositoryStore = defineStore("user", {
    state: () => ({
        account: null as null | string,
        repositories: [],
        contributors: [],
        versions: [],
        latestVersion: null as null | string,
    }),
    getters: {
        getAcccount: (state) => state.account,
        getRepositories: (state) => state.repositories,
        getContributors: (state) => state.contributors,
        getVersions: (state) => state.versions,
        getLatestVersionn: (state) => state.latestVersion,
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
                const signer = provider.getSigner()
                const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                // let isAlreadyUser = await repositoryFactoryContract.isAlreadyUser()
                // console.log(isAlreadyUser)
                // if (isAlreadyUser){
                // }else {
                //     console.log("vykonalo")
                //
                //     await a.wait()const a = await repositoryFactoryContract.addUser()
                // }

                const rawRepositories = await repositoryFactoryContract.getUserRepos(this.account)
                console.log("aeuhwe: ", await repositoryFactoryContract.getUsers())
                // const rawRepositories = await repositoryFactoryContract.getAllRepositories()
                console.log(rawRepositories)
                this.repositories = []
                for (const repository of rawRepositories) {
                    console.log("Repo address: ", repository)
                    const repositoryProxy = new ethers.Contract(repository, RepositoryABI.abi, provider)
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    // console.log("Time format: ", repoTimeFormatted)
                    const description = await repositoryProxy.description()

                    // console.log("REPOSITORY NAME", name)
                    const repositoryData = {
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                    }
                    console.log("Repository data:", name, owner, repoTime, description)
                    this.repositories.push(repositoryData)
                    console.log("After repository data: ", this.repositories)
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
                    console.log("provider:", provider)
                    console.log("signer:", signer)
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    /*
                     * Execute the actual wave from your smart contract
                     */
                    console.log("a", getAddress(this.account))
                    console.log("New repository creation data: ", newRepository)
                    const repositoryTxn = await repositoryFactoryContract.createRepositoryContract(newRepository.name, newRepository.description)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    // console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    console.log("Repo address: ", transaction.logs[0].address)

                    console.log("Repositories: ", await repositoryFactoryContract.getUserRepos(this.account))
                    let repositoryProxy = new ethers.Contract(transaction.logs[0].address, RepositoryABI.abi, provider)
                    const repoHash = transaction.logs[0].address
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    // console.log("Time format: ", repoTimeFormatted)
                    const description = await repositoryProxy.description()
                    // const contri = await repositoryProxy.contributors()
                    // console.log("REPOSITORY NAME", name)

                    const repositoryData = {
                        address: repoHash,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                    }
                    console.log("Repository data:", repoHash, name, owner, repoTime, description)
                    this.repositories.push(repositoryData)
                    console.log("After repository data: ", this.repositories)
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async addContributor(RepoAddress: string, ConAddress: string, ConName: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(RepoAddress, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.addContributor(ConAddress, ConName)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getRepositoryContributors(RepoAddress: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(RepoAddress, RepositoryABI.abi, provider)
                    this.contributors = await repositoryContract.getContributors()
                    console.log("Contributors: ", this.contributors)
                }
            } catch (error) {
                console.log(error)
            }
        },

        async addVersionOfRepository(repoAddress: string, ipfsHash: string, commitName: string){
            console.log("add version")
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    // get repository
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.addVersionOfRepository(commitName, ipfsHash)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                }
            } catch (error) {
                console.log(error)
            }
        },

        async getVersionsOfRepository(repoAddress: string){
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, provider)
                    const versionsHashes = await repositoryContract.getVersionsHashes()
                    console.log("Versions: ", this.versions)


                    for (const versionHash of versionsHashes) {
                        console.log(await repositoryContract.getVersion(versionHash))

                        // const name = await repositoryProxy.name()
                        // const owner = await repositoryProxy.owner()
                        // const createdAt = await repositoryProxy.createdAt()
                        // const repoTime = new Date(createdAt * 1000)
                        // const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                        // // console.log("Time format: ", repoTimeFormatted)
                        // const description = await repositoryProxy.description()
                        //
                        // // console.log("REPOSITORY NAME", name)
                        // const repositoryData = {
                        //     name: name,
                        //     createdAt: repoTimeFormatted,
                        //     owner: owner,
                        //     description: description,
                        //     versionHashes: [],
                        //     version: "",
                        // }
                        // console.log("Repository data:", name, owner, repoTime, description)
                        // this.repositories.push(repositoryData)
                        // console.log("After repository data: ", this.repositories)
                    }

                }
            } catch (error) {
                console.log(error)
            }
        },
        async getLatestVersion(repoAddress: string){
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, provider)
                    const versionsHashes = await repositoryContract.getVersionsHashes()
                    this.latestVersion = await repositoryContract.getVersion(versionsHashes[versionsHashes.length - 1])
                    this.latestVersion = this.latestVersion[3]
                    console.log(this.latestVersion)
                }
            } catch (error) {
                this.latestVersion = ""
                console.log(error)
            }
        },
    },
    persist: true,
})

// if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

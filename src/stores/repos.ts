import { ethers } from "ethers"
import { acceptHMRUpdate, defineStore } from "pinia"
import contractABI from "../artifacts/contracts/RepositoryFactory.sol/RepositoryFactory.json"
import RepositoryABI from "../artifacts/contracts/Repository.sol/Repository.json"

import { RepositoryMeta } from "~/types/repository"
import { MilestoneMeta } from "~/types/milestone"
import { Review, SkillLevel } from "~/types/review"

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const useRepositoryStore = defineStore("user", {
    state: () => ({
        account: null as null | string,
        repositories: [],
        contributors: [],
        score: null as null | number,
        reviews: [],
    }),
    getters: {
        getAcccount: (state) => state.account,
        getRepositories: (state) => state.repositories,
        getContributors: (state) => state.contributors,
        getScore: (state) => state.score,
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
                this.account = myAccounts[0]
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                // // const signer = provider.getSigner()
                // const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                const userReviewScore = await repositoryFactoryContract.getUserReviewScore(this.account)
                this.score = userReviewScore
                const rawRepositories = await repositoryFactoryContract.getUserRepos(this.account)
                this.repositories = []
                for (const repository of rawRepositories) {
                    const repositoryProxy = new ethers.Contract(repository, RepositoryABI.abi, provider)
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    const description = await repositoryProxy.description()

                    const repositoryData = {
                        repositoryHash: repository,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                    }
                    this.repositories.push(repositoryData)
                }
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
                    console.log("New repository creation data: ", newRepository)
                    const repositoryTxn = await repositoryFactoryContract.createRepositoryContract(newRepository.name, newRepository.description)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    const event = transaction.events.find((event) => event.event === "NewRepositorySet")
                    const repositoryHash = event.args.repository
                    // console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    // console.log("Repo address: ", transaction.logs[0].address)

                    console.log("Repositories: ", await repositoryFactoryContract.getUserRepos(this.account))
                    const repositoryProxy = new ethers.Contract(transaction.logs[0].address, RepositoryABI.abi, provider)
                    console.log("Proxy: ", await repositoryProxy)
                    // const repositoryhash = await repositoryProxy.repository()
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    const description = await repositoryProxy.description()
                    // const contri = await repositoryProxy.contributors()
                    // console.log("REPOSITORY NAME", name)

                    const repositoryData = {
                        repositoryHash: repositoryHash,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                    }
                    this.repositories.push(repositoryData)
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async addContributor(RepoAddress: string, ConAddress: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(RepoAddress, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.addContributor(ConAddress, "Fero")
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

        async addMilestone(newMilestone: MilestoneMeta) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(`0xa16E02E87b7454126E5E10d957A927A7F5B5d2be`, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.addMilestone(newMilestone.title, newMilestone.title)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    const allMilestones = await repositoryContract.getAllMilestones()
                    console.log("allmilestones: ", allMilestones)
                }
            } catch (error) {
                console.log(error)
            }
        },

        async completeMilestone() {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(`0xa16E02E87b7454126E5E10d957A927A7F5B5d2be`, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.completeMilestone()
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    const allMilestones = await repositoryContract.getAllMilestones()
                    console.log("allmilestones: ", allMilestones)
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
        async getReviewsByRepository(repositoryHash: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                    return await repositoryContract.getRepositoryReviews(repositoryHash)
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getReviewerScore(reviewerAddress: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                    return await repositoryContract.getUserReviewScore(reviewerAddress)
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getNewReview(repository: string) {
            // event ReviewAdded(address repository, address reviewer, uint reviewerSkillLevel, string contentIdentifier, uint rating);
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                    // const usdcAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" ///USDC Contract
                    const filter = repositoryFactoryContract.filters.ReviewAdded(repository, null)
                    // eslint-disable-next-line no-use-before-define
                    repositoryFactoryContract.on(filter, (...event) => {
                        console.log("Review: ", {
                            repositoryHash: event[5].args.repository,
                            reviewer: event[5].args.reviewer,
                            reviewerSkillLevel: event[5].args.reviewerSkillLevel.toString(),
                            rating: event[5].args.rating.toString(),
                            contentIdentifier: event[5].args.contentIdentifier,
                        })
                        return {
                            repositoryHash: event[5].args.repository,
                            reviewer: event[5].args.reviewer,
                            reviewerSkillLevel: event[5].args.reviewerSkillLevel.toString(),
                            rating: event[5].args.rating.toString(),
                            contentIdentifier: event[5].args.contentIdentifier,
                        }
                    })
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async createReview(newReview: Omit<Review, "reviewer">): Promise<Review> {
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                    console.log("New review: ", newReview)
                    const repositoryTxn = await repositoryFactoryContract.createReview(newReview.repositoryHash, newReview.contentIdentifier, newReview.rating, newReview.reviewerSkillLevel)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    const eventData = transaction.events.find((event) => event.event === "ReviewAdded").args
                    // console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)
                    return {
                        reviewer: eventData.reviewer,
                        reviewerScore: await this.getReviewerScore(eventData.reviewer),
                        reviewerSkillLevel: eventData.reviewerSkillLevel,
                        rating: eventData.rating,
                        contentIdentifier: eventData.contentIdentifier,
                    }
                } else {
                    throw new "Ethereum object doesn't exist!"()
                }
            } catch (error) {
                throw new error()
            }
        },
    },
    persist: true,
})

// if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

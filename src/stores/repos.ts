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
        toReviewRepositories: [],
    }),
    getters: {
        getAcccount: (state) => state.account,
        getRepositories: (state) => state.repositories,
        getContributors: (state) => state.contributors,
        getScore: (state) => state.score,
        getToReviewRepositories: (state) => state.toReviewRepositories,
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
                this.toReviewRepositories = []
                for (const repository of rawRepositories) {
                    const repositoryProxy = new ethers.Contract(repository, RepositoryABI.abi, provider)
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    const description = await repositoryProxy.description()
                    const toReview = await repositoryProxy.toReview()

                    const repositoryData = {
                        repositoryHash: repository,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                        // toReviewLimit: toReviewLimit,
                        // numOfReviews: numOfReviews,
                    }
                    if (toReview > 0) {
                        const requiredReviews = await repositoryProxy.getLastCompletedMilestone()
                        console.log("aa: ", requiredReviews)
                        const repositoryReviewData = {
                            repositoryHash: repository,
                            name: name,
                            createdAt: repoTimeFormatted,
                            owner: owner,
                            description: description,
                            versionHashes: [],
                            version: "",
                            requiredReviews: requiredReviews.numberOfRequiredReviews,
                            committedReviews: requiredReviews.numberOfCommittedReviews,
                        }
                        this.toReviewRepositories.push(repositoryReviewData)
                    }
                    this.repositories.push(repositoryData)
                }
                console.log(this.toReviewRepositories)
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
                    const toReview = await repositoryProxy.toReview()
                    this.toReviewRepositories = []

                    const repositoryData = {
                        repositoryHash: repositoryHash,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versionHashes: [],
                        version: "",
                        // toReviewLimit: toReviewLimit,
                        // numOfReviews: numOfReviews,
                    }
                    if (toReview > 0) {
                        const requiredReviews = await repositoryProxy.getLastCompletedMilestone()
                        console.log("aa: ", requiredReviews)
                        const repositoryReviewData = {
                            repositoryHash: repository,
                            name: name,
                            createdAt: repoTimeFormatted,
                            owner: owner,
                            description: description,
                            versionHashes: [],
                            version: "",
                            requiredReviews: requiredReviews.numberOfRequiredReviews,
                            committedReviews: requiredReviews.numberOfCommittedReviews,
                        }
                        this.toReviewRepositories.push(repositoryReviewData)
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
        async createMilestone(newMilestone: MilestoneMeta, repositoryHash: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, signer)
                    // await repositoryContract.setNumberOfReviews(2)
                    const repositoryTxn = await repositoryContract.addMilestone(newMilestone.deadline, newMilestone.title, newMilestone.description)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    const eventData = transaction.events.find((event) => event.event === "MilestoneAdded").args
                    return {
                        id: eventData.id,
                        completed: false,
                        title: eventData.title,
                        description: eventData.description,
                        requestReview: eventData.requestReview,
                        deadline: eventData.deadline,
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getMilestones(repositoryHash: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, provider)
                    console.log("Repository contract: ", repositoryContract)
                    const allMilestones = await repositoryContract.getAllMilestones()
                    return await Promise.all(
                        allMilestones.map(async (milestone: MilestoneMeta) => {
                            return {
                                id: milestone.id?.toString(),
                                title: milestone.title,
                                description: milestone.description,
                                deadline: milestone.deadline.toString(),
                                requestReview: milestone.requestReview,
                                completed: milestone.completed,
                            }
                        })
                    )
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
                    const repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.completeMilestone(0, 1) //index milestonu, pocet reviews ak 0 tak neni reviewable

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
                    const repositoryTxn = await repositoryFactoryContract.createReview(newReview.repositoryHash, newReview.contentIdentifier, newReview.rating, newReview.reviewerSkillLevel, 0) //milestoneid
                    console.log("Mining...", repositoryTxn)
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
                console.log(error)
                throw new error()
            }
        },
    },
    persist: true,
})

// if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

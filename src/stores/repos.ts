import { ethers } from "ethers"
import { defineStore } from "pinia"
import contractABI from "../artifacts/contracts/RepositoryFactory.sol/RepositoryFactory.json"
import RepositoryABI from "../artifacts/contracts/Repository.sol/Repository.json"

import { RepositoryMeta } from "~/types/repository"
import { MilestoneMeta } from "~/types/milestone"
import { Review } from "~/types/review"

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const useRepositoryStore = defineStore("user", {
    state: () => ({
        account: null as null | string,
        repositories: [],
        toReviewRepositories: [],
        reviews: [],
        score: null as null | number,
    }),
    getters: {
        getAcccount: (state) => state.account,
        getRepositories: (state) => state.repositories,
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
            } catch (error) {
                console.log(error)
            }
        },
        async fetchRepositories() {
            try {
                const { ethereum } = window
                if (ethereum) {
                    this.repositories = []
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    const rawRepositories = await repositoryFactoryContract.getUserRepos(this.account)
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
                            versions: [],
                            latestVersion: [],
                            contributors: [],
                        }
                        this.repositories.push(repositoryData)
                        await this.getVersionsOfRepository(repository)
                        await this.getRepositoryContributors(repository)
                    }
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getRepositoryByHash(repositoryHash: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    this.toReviewRepositories = []
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    const rawRepository = await repositoryFactoryContract.getRepositoryByHash(repositoryHash)
                    console.log("RawRepository: ", rawRepository)
                    if (rawRepository) {
                        const repositoryProxy = new ethers.Contract(repositoryHash, RepositoryABI.abi, provider)
                        const name = await repositoryProxy.name()
                        const owner = await repositoryProxy.owner()
                        const createdAt = await repositoryProxy.createdAt()
                        const repoTime = new Date(createdAt * 1000)
                        const repoTimeFormatted = new Intl.DateTimeFormat("en", {
                            dateStyle: "full",
                            timeStyle: "short",
                            timeZone: "Europe/Bratislava",
                        }).format(repoTime) as any
                        const description = await repositoryProxy.description()
                        return {
                            repositoryHash: repositoryHash,
                            name: name,
                            createdAt: repoTimeFormatted,
                            owner: owner,
                            description: description,
                            versions: [],
                            latestVersion: [],
                            contributors: [],
                        }
                    } else {
                        console.log("Ethereum object doesn't exist!")
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },

        async fetchReviewableRepositories() {
            try {
                const { ethereum } = window
                if (ethereum) {
                    this.toReviewRepositories = []
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    const rawReviewableRepositories = await repositoryFactoryContract.getReviewableRepositories()
                    for (const repository of rawReviewableRepositories) {
                        const repositoryProxy = new ethers.Contract(repository, RepositoryABI.abi, provider)
                        const name = await repositoryProxy.name()
                        const owner = await repositoryProxy.owner()
                        const createdAt = await repositoryProxy.createdAt()
                        const repoTime = new Date(createdAt * 1000)
                        const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                        const description = await repositoryProxy.description()
                        const toReview = await repositoryProxy.toReview()
                        if (toReview > 0) {
                            const requiredReviews = await repositoryProxy.getAllReviewableMilestones()
                            const repositoryReviewData = {
                                repositoryHash: repository,
                                name: name,
                                createdAt: repoTimeFormatted,
                                owner: owner,
                                description: description,
                                milestone: [],
                            }
                            for (const repoMilestone of requiredReviews) {
                                const rawVersion = await repositoryProxy.version(repoMilestone.versionHash)
                                repositoryReviewData.milestone.push({
                                    version: {
                                        timestamp: rawVersion.timestamp.toNumber(),
                                        committer: rawVersion.committer,
                                        commitName: rawVersion.commitName,
                                        ipfsHash: rawVersion.ipfsHash,
                                    },
                                    requiredReviews: repoMilestone.numberOfRequiredReviews.toNumber(),
                                    committedReviews: repoMilestone.numberOfCommittedReviews.toNumber(),
                                    id: repoMilestone.id.toNumber(),
                                    deadline: parseFloat(repoMilestone.deadline.toString()),
                                    title: repoMilestone.title,
                                    description: repoMilestone.description,
                                    completed: repoMilestone.completed,
                                })
                            }
                            this.toReviewRepositories.push(repositoryReviewData)
                        }
                    }
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchReviewableRepositoryMilestones(repositoryHash: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    let reviewableRepository = {}
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryProxy = new ethers.Contract(repositoryHash, RepositoryABI.abi, provider)
                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    const description = await repositoryProxy.description()
                    const toReview = await repositoryProxy.toReview()
                    if (toReview > 0) {
                        const requiredReviews = await repositoryProxy.getAllReviewableMilestones()
                        const repositoryReviewData = {
                            repositoryHash,
                            name,
                            createdAt: repoTimeFormatted,
                            owner,
                            description,
                            milestones: [],
                        }
                        for (const repoMilestone of requiredReviews) {
                            const rawVersion = await repositoryProxy.version(repoMilestone.versionHash)
                            repositoryReviewData.milestones.push({
                                version: {
                                    timestamp: rawVersion.timestamp.toNumber(),
                                    committer: rawVersion.committer,
                                    commitName: rawVersion.commitName,
                                    ipfsHash: rawVersion.ipfsHash,
                                },
                                requiredReviews: repoMilestone.numberOfRequiredReviews.toNumber(),
                                committedReviews: repoMilestone.numberOfCommittedReviews.toNumber(),
                                id: repoMilestone.id.toNumber(),
                                deadline: parseFloat(repoMilestone.deadline.toString()),
                                title: repoMilestone.title,
                                description: repoMilestone.description,
                                completed: repoMilestone.completed,
                            })
                        }
                        reviewableRepository = repositoryReviewData
                    }
                    return reviewableRepository
                } else {
                    console.log("Ethereum object doesn't exist!")
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
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    /*
                     * Execute the actual wave from your smart contract
                     */
                    const repositoryTxn = await repositoryFactoryContract.createRepositoryContract(newRepository.name, newRepository.description)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    const event = transaction.events.find((event) => event.event === "NewRepositorySet")
                    const repositoryHash = event.args.repository
                    console.log("Mined -- ", repositoryTxn.hash)

                    const repositoryProxy = new ethers.Contract(transaction.logs[0].address, RepositoryABI.abi, provider)

                    const name = await repositoryProxy.name()
                    const owner = await repositoryProxy.owner()
                    const createdAt = await repositoryProxy.createdAt()
                    const repoTime = new Date(createdAt * 1000)
                    const repoTimeFormatted = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(repoTime) as any
                    const description = await repositoryProxy.description()
                    this.toReviewRepositories = []

                    const repositoryData = {
                        repositoryHash: repositoryHash,
                        name: name,
                        createdAt: repoTimeFormatted,
                        owner: owner,
                        description: description,
                        versions: [],
                        latestVersion: [],
                        contributors: [],
                    }
                    this.getRepositoryContributors(repositoryHash)

                    this.repositories.push(repositoryData)
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                console.log(error)
            }
        },
        async addContributor(repoAddress: string, ConAddress: string, ConName: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                    const repo = this.repositories.find((repo) => repo.repositoryHash == repoAddress)
                    if (repo.contributors.find((repo) => repo.contributors == ConAddress)) {
                        console.log("User is already contributor")
                        return
                    }

                    // get repository
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, signer)

                    console.log(repositoryContract)
                    const repositoryTxn1 = await repositoryFactoryContract.addRepositoryToUser(ConAddress, repositoryContract.address, ConName)
                    console.log("Mining...", repositoryTxn1.hash)
                    const transaction1 = await repositoryTxn1.wait()
                    console.log("Event: ", transaction1.logs)
                    console.log("Transaction reciept: ", transaction1)
                    console.log("Mined -- ", repositoryTxn1.hash)

                    const contributor = await repositoryContract.getContributor(ConAddress)
                    const cons = {
                        id: contributor[0],
                        name: contributor[1],
                        address: ConAddress,
                    }
                    repo.contributors.push(cons)
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
                        title: eventData.milestoneName,
                        description: eventData.milestoneDescription,
                        requestReview: eventData.requestReview,
                        deadline: parseFloat(eventData.deadline.toString()),
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

                    const allMilestones = await repositoryContract.getAllMilestones()
                    return await Promise.all(
                        allMilestones.map(async (milestone: MilestoneMeta) => {
                            console.log("Milestone1: ", milestone)
                            return {
                                id: milestone.id,
                                title: milestone.title,
                                description: milestone.description,
                                deadline: parseFloat(milestone.deadline.toString()),
                                requestReview: milestone.requestReview,
                                completed: milestone.completed,
                                versionHash: milestone.versionHash,
                                ...(milestone.versionHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" && {
                                    versionCommitName: (await repositoryContract.getVersion(milestone.versionHash)).commitName,
                                }),
                            }
                        })
                    )
                }
            } catch (error) {
                console.log(error)
            }
        },
        async completeMilestone(repositoryHash: string, milestoneId: number, numberOfReviews: number) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    // get repository
                    const repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.completeMilestone(milestoneId, numberOfReviews) //index milestonu, pocet reviews ak 0 tak neni reviewable

                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    const eventData = transaction.events.find((event) => event.event === "MilestoneCompleted").args
                    if (eventData) {
                        return true
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getRepositoryContributors(repoAddress: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, provider)
                    const contributorsAddress = await repositoryContract.getContributors()
                    const repo = this.repositories.find((repo) => repo.repositoryHash == repoAddress)
                    for (const contributorAddress of contributorsAddress) {
                        const contributor = await repositoryContract.getContributor(contributorAddress)

                        const cons = {
                            id: contributor[0],
                            name: contributor[1],
                            address: contributorAddress,
                        }

                        repo.contributors.push(cons)
                    }
                    return repo.contributors
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
                    const reviews = []
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                    const repositorReviews = await repositoryFactoryContract.getRepositoryReviews(repositoryHash)
                    const repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, provider)
                    for (const review of repositorReviews) {
                        const reviewMilestone = await repositoryContract.milestones(review.milestoneId.toNumber())
                        console.log("Rev: ", reviewMilestone)
                        const version = await repositoryContract.getVersion(reviewMilestone.versionHash)
                        const reviewWithMilestone = {
                            contentIdentifier: review.contentIdentifier,
                            id: review.id.toNumber(),
                            rating: review.rating.toNumber(),
                            repository: review.repository,
                            reviewer: review.reviewer,
                            reviewerScore: await this.getReviewerScore(review.reviewer),
                            reviewerSkillLevel: review.reviewerSkillLevel,
                            reward: parseFloat(ethers.utils.formatEther(review.reward.toString())),
                            milestone: {
                                title: reviewMilestone.title,
                                description: reviewMilestone.description,
                                versionName: (await repositoryContract.getVersion(reviewMilestone.versionHash)).commitName,
                            },
                        }
                        console.log("Rewaaard: ", reviewWithMilestone)
                        reviews.push(reviewWithMilestone)
                    }
                    return reviews
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
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
                    const filter = repositoryFactoryContract.filters.ReviewAdded(repository, null)
                    // eslint-disable-next-line no-use-before-define
                    repositoryFactoryContract.on(filter, (...event) => {
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
                    const repositoryTxn = await repositoryFactoryContract.createReview(
                        newReview.repositoryHash,
                        newReview.contentIdentifier,
                        newReview.rating,
                        newReview.reviewerSkillLevel,
                        newReview.milestoneId
                    )
                    console.log("Mining...", repositoryTxn)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    const eventData = transaction.events.find((event) => event.event === "ReviewAdded").args
                    console.log("Mined -- ", repositoryTxn.hash)
                    return {
                        reviewer: eventData.reviewer,
                        reviewerScore: await this.getReviewerScore(eventData.reviewer),
                        reviewerSkillLevel: eventData.reviewerSkillLevel,
                        rating: eventData.rating,
                        contentIdentifier: eventData.contentIdentifier,
                        milestoneId: eventData.milestoneId,
                    }
                } else {
                    throw new "Ethereum object doesn't exist!"()
                }
            } catch (error) {
                console.log(error)
                throw new error()
            }
        },

        async rewardReview(reviewer: string, reviewId: number, ethersAmount: number) {
            try {
                const { ethereum } = window
                console.log("revawfa: ", reviewer, reviewId, ethersAmount)
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                    const repositoryTxn = await repositoryFactoryContract.payReviewer(reviewer, reviewId, { value: ethers.utils.parseEther(ethersAmount.toString()) })
                    console.log("Mining...", repositoryTxn)
                    const transaction = await repositoryTxn.wait()
                    const eventData = transaction.events.find((event) => event.event === "ReviewRewarded").args
                    console.log("Mined -- ", repositoryTxn.hash)
                    return parseFloat(ethers.utils.formatEther(eventData.reward.toString()))
                } else {
                    throw new "Ethereum object doesn't exist!"()
                }
            } catch (error) {
                console.log(error)
                throw new error()
            }
        },

        async addVersionOfRepository(repoAddress: string, ipfsHash: string, commitName: string) {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    // get repository
                    let repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, signer)

                    const repositoryTxn = await repositoryContract.addVersionOfRepository(commitName, ipfsHash)
                    console.log("Mining...", repositoryTxn.hash)
                    const transaction = await repositoryTxn.wait()
                    console.log("Event: ", transaction.logs)
                    console.log("Transaction reciept: ", transaction)
                    console.log("Mined -- ", repositoryTxn.hash)

                    repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, provider)
                    const repo = this.repositories.find((repo) => repo.repositoryHash == repoAddress)
                    const latestVersion = await repositoryContract.getLatestVersion()
                    repo.versions.push(latestVersion)
                    repo.latestVersion = latestVersion
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getLastVersionHashOfRepository(repositoryHash: string): Promise<any> {
            try {
                const { ethereum } = window
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    let repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, signer)

                    repositoryContract = new ethers.Contract(repositoryHash, RepositoryABI.abi, provider)
                    const latestVersion = await repositoryContract.getVersionsHashes()
                    if (latestVersion.length) {
                        return latestVersion[latestVersion.length - 1]
                    } else {
                        return ""
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getVersionsOfRepository(repoAddress: string): Promise<any> {
            try {
                const { ethereum } = window
                if (ethereum) {
                    // create provider object from ethers library, using ethereum object injected by metamask
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const repositoryContract = new ethers.Contract(repoAddress, RepositoryABI.abi, provider)
                    const versionsHashes = await repositoryContract.getVersionsHashes()

                    const repo = this.repositories.find((repo) => repo.repositoryHash == repoAddress)
                    for (const versionHash of versionsHashes) {
                        const version = await repositoryContract.getVersion(versionHash)
                        repo.versions.push(version)
                    }

                    repo.latestVersion = repo.versions[repo.versions.length - 1]
                    return repo.versions
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
    persist: true,
})

// if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

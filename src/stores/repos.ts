import { ethers } from "ethers"
import { acceptHMRUpdate, defineStore } from "pinia"
import contractABI from "../artifacts/contracts/RepositoryFactory.sol/RepositoryFactory.json"
const contractAddress = "0x222301fA451400abA5EF63FCdbF046e6787ffF4D" //"0x9A5B8A941A6B9a4f4d3A6876eb5D30045181A7bE"

export const useRepositoryStore = defineStore("user", () => {
    const account = ref(null)
    const postedRepositories = ref([] as any)
    const loading = ref(false)

    async function getAllRepositories() {
        setLoader(true)
        try {
            const { ethereum } = window
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                console.log(account.value)
                const repositories = await repositoryFactoryContract.getUserRepos(account.value)
                console.log(repositories)
                console.log(repositories[0].name)

                const allRepositories = [] as any
                repositories.forEach((repository) => {
                    allRepositories.push({
                        name: repository.name,
                        timestamp: repository.timestamp,
                    })
                })
                postedRepositories.value = allRepositories
                setLoader(false)
            }
        } catch (e) {
            setLoader(false)
            console.log(e)
        }
    }

    async function connectWallet() {
        console.log("pls")
        try {
            const { ethereum } = window
            if (!ethereum) {
                console.log("Must connect to MetaMask!")
                return
            }
            console.log("vxc")
            const myAccounts = await ethereum.request({ method: "eth_requestAccounts" })
            console.log(myAccounts)
            console.log("Connected: ", myAccounts[0])
            account.value = myAccounts[0]
            await getAllRepositories()
        } catch (error) {
            console.log(error)
        }
    }

    async function createRepository(messageInput) {
        console.log("setting loader")
        setLoader(true)
        try {
            console.log("got", messageInput)
            const { ethereum } = window
            if (ethereum) {
                // create provider object from ethers library, using ethereum object injected by metamask
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const repositoryFactoryContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                /*
                 * Execute the actual wave from your smart contract
                 */
                const repositoryTxn = await repositoryFactoryContract.createRepositoryContract(messageInput)
                console.log("Mining...", repositoryTxn.hash)
                await repositoryTxn.wait()
                console.log("Mined -- ", repositoryTxn.hash)

                messageInput = ""
                setLoader(false)
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            setLoader(false)
            console.log(error)
        }
    }

    function setLoader(value: boolean) {
        console.log("setloader", value)
        loading.value = value
    }

    return {
        setLoader,
        loading,
        connectWallet,
        account,
        createRepository,
        postedRepositories,
    }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))

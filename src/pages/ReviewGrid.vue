<template>
    <SidebarLayout>
        <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div class="min-w-0 flex-1">
                <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Repository to review</h1>
            </div>
        </div>
        <div class="bg-white px-8 2xl:px-40">
            <div class="mx-auto py-10 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                <div class="col-span-5">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">Repository overview</h2>

                    <div v-if="repositoryReviewableVersions" class="mt-3 flex items-center">
                        <div class="flex flex-col w-full">
                            <div class="font-medium text-sm text-gray-900">Versions</div>
                            <div class="flex items-center justify-between space-x-4">
                                <VersionHistoryDropdown class="w-full" :versions="repositoryReviewableVersions" @change-version="changeVersion" />
                                <div>
                                    <div
                                        @click="downloadRepository('currentVersionHash')"
                                        class="whitespace-nowrap cursor-pointer text-sm group flex items space-x-2 medium text-violet-500 hover:text-violet-800 focus:outline-none transition ease-in-out hover:scale-105 duration-300"
                                    >
                                        <div>Download zip</div>
                                        <div class="ml-2">
                                            <div v-if="loaderStep === 0">
                                                <svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="gray-200"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="violet-700"
                                                    />
                                                </svg>
                                            </div>
                                            <div v-else-if="loaderStep < 0"><DownloadRepositoryIcon class="w-4" /></div>
                                            <div v-else>
                                                <svg aria-hidden="true" class="w-4 h-4 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

                    <div class="mt-3 flex items-center">
                        <div>
                            <div class="flex items-center">
                                <StarIcon
                                    v-for="rating in [0, 1, 2, 3, 4]"
                                    :key="rating"
                                    :class="[info.average > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                                    aria-hidden="true"
                                />
                            </div>
                            <p class="sr-only">{{ info.average }} out of 5 stars</p>
                        </div>
                        <p class="ml-2 text-sm text-gray-900">Based on {{ info.totalCount }} reviews</p>
                    </div>

                    <div class="mt-6">
                        <h3 class="sr-only">Review data</h3>

                        <dl class="space-y-3">
                            <div v-for="count in info.counts" :key="count.rating" class="flex items-center text-sm">
                                <dt class="flex flex-1 items-center">
                                    <p class="w-3 font-medium text-gray-900">{{ count.rating }}<span class="sr-only"> star reviews</span></p>
                                    <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
                                        <StarIcon :class="[count.count > 0 ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />

                                        <div class="relative ml-3 flex-1">
                                            <div class="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                            <div
                                                v-if="count.count > 0"
                                                class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                                :style="{ width: `calc(${count.count} / ${info.totalCount === 0 ? 1 : info.totalCount} * 100%)` }"
                                            />
                                        </div>
                                    </div>
                                </dt>
                                <dd class="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">{{ Math.round((count.count / (info.totalCount === 0 ? 1 : info.totalCount)) * 100) }}%</dd>
                            </div>
                        </dl>
                    </div>

                    <div class="mt-10">
                        <h3 class="text-lg font-medium text-gray-900">Share your thoughts</h3>
                        <p class="mt-1 text-sm text-gray-600">If you’ve used this product, share your thoughts with other customers</p>

                        <button
                            :disabled="!repositoryReviewableVersions"
                            type="button"
                            :class="{ 'opacity-50 cursor-not-allowed': !repositoryReviewableVersions }"
                            class="text-center w-full flex justify-center cursor-pointer items-center rounded-md bg-violet-700 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            @click="triggerCreateReview(true)"
                        >
                            <PencilSquareIcon class="mr-2 h-4 w-4 text-white" />
                            Add review
                        </button>
                        <div v-if="!repositoryReviewableVersions" class="text-gray-500 py-4 text-center">
                            No required reviews for this repository at this moment. Come back later and share your thougths!
                        </div>
                    </div>
                </div>

                <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                    <div v-if="reviews?.length" class="flow-root">
                        <div class="-my-12 divide-y divide-gray-200">
                            <div v-for="review in reviews" :key="review.contentIdentifier" class="py-12 px-6">
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-col space-y-2.5">
                                        <div class="flex items-center space-x-2">
                                            <div class="bg-gray-100 p-1 rounded-full" v-html="toSvg(review.reviewer, 25)"></div>
                                            <div class="flex flex-col">
                                                <h4 class="text-sm font-bold text-gray-900">{{ review.reviewer }}</h4>

                                                <div class="flex flex-wrap overflow-hidden text-ellipsis whitespace-normal">
                                                    <div class="mr-1 mt-1 h-max">
                                                        <div class="h-6 w-fit rounded bg-violet-50">
                                                            <div class="pl-2 mr-2 pt-[.2rem] text-xs font-normal">#{{ SkillLevel[review.reviewerSkillLevel] }}</div>
                                                        </div>
                                                    </div>
                                                    <div class="mr-1 mt-1 h-max">
                                                        <div class="h-6 w-fit rounded bg-violet-50">
                                                            <div class="ml-2 mr-2 pt-[.2rem] text-xs font-normal">#{{ review.reviewerScore }} reviews</div>
                                                        </div>
                                                    </div>
                                                    <div class="mr-1 mt-1 h-max">
                                                        <div class="h-6 w-fit rounded bg-sky-50">
                                                            <div class="pl-2 mr-2 pt-[.2rem] text-xs font-normal">#{{ review.milestone.versionName }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center w-full justify-between">
                                            <div class="ml-10">
                                                <div class="mt-1 flex items-center">
                                                    <StarIcon
                                                        v-for="rating in [0, 1, 2, 3, 4]"
                                                        :key="rating"
                                                        :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            @click="downloadFile(review.contentIdentifier)"
                                            class="whitespace-nowrap ml-10 justify-start cursor-pointer text-sm group flex items space-x-2 medium text-violet-500 hover:text-violet-800 focus:outline-none transition ease-in-out hover:scale-105 duration-300"
                                        >
                                            <div>Download review</div>
                                            <DownloadReviewIcon class="ml-1 w-4" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col space-y-2 h-11 justify-center items-center w-full px-6">
                                        <div class="cursor-pointer transition ease-in-out hover:scale-120 duration-300" @click="setReward(review.reviewer, review.id)">
                                            <img alt="PayEthers" :src="PayIcon" class="w-8 h-8" />
                                        </div>
                                        <div class="text-gray-500 text-sm">Rewarded: {{ review.reward }} Ethers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="flex flex-col justify-center items-center h-full text-gray-400 px-20 text-center">
                        No reviews have been added yet. Share your thoughts and be the first to leave a review!
                    </div>
                </div>
            </div>
            <AddReviewSlideOver
                v-if="repositoryWithMilestones"
                :repository="repositoryWithMilestones"
                title="Add new review"
                :open="showCreateReview"
                @close="triggerCreateReview(false)"
                @create="createNewReview"
            />
        </div>
        <TransitionRoot appear :show="showEthersModal" as="template">
            <Dialog as="div" @close="showEthersModal = false" class="relative z-10">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> Payment </DialogTitle>
                                <div class="mt-2">
                                    <div>
                                        <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Reward</label>
                                        <div class="relative mt-1 rounded-md shadow-sm">
                                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span class="text-gray-500 sm:text-sm"><img class="h-4.5 w-4.5" :src="EtherIcon" alt="Ethereum Icon" /> </span>
                                            </div>
                                            <input
                                                v-model="reviewToReward.ethersAmount"
                                                min="0.1"
                                                type="number"
                                                name="price"
                                                id="price"
                                                :class="[invalidEthersAmount ? 'ring-red-400' : 'ring-gray-300']"
                                                class="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                                placeholder="0.00"
                                                aria-describedby="price-currency"
                                            />
                                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span class="text-gray-500 sm:text-sm" id="price-currency">Ethers</span>
                                            </div>
                                        </div>
                                        <div v-if="invalidEthersAmount" class="text-sm text-red-500 py-1 ml-2">The minimum amount of ethers to send as reward is 0.01 Ethers.</div>
                                    </div>
                                </div>

                                <div class="mt-4 flex justify-between">
                                    <button
                                        type="button"
                                        class="order-0 inline-flex items-center rounded-md bg-violet-300 px-3 py-2 text-sm font-semibold text-indigo-700 font-medium shadow-sm hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1"
                                        @click="showEthersModal = false"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1"
                                        @click="rewardReview"
                                    >
                                        Pay reward
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </SidebarLayout>
</template>

<script setup lang="ts">
import { PencilSquareIcon, StarIcon, ArrowDownTrayIcon as DownloadReviewIcon } from "@heroicons/vue/20/solid"
import { Ref, ref, computed, onMounted } from "vue"
import { Review, SkillLevel } from "~/types/review"
import { useRepositoryStore } from "~/stores/repos"
import { toSvg } from "jdenticon"
import { useRoute } from "vue-router"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { ArrowDownTrayIcon as DownloadRepositoryIcon } from "@heroicons/vue/20/solid"
import PayIcon from "~/img/ethPay.png"
import EtherIcon from "~/img/ethereum.png"
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"

const showEthersModal = ref(false)

const repositoryStore = useRepositoryStore()
const route = useRoute()

const repositoryHash = route.params.projectHash

const repositoryWithMilestones = ref()
const reviews = ref()
const repositoryReviewableVersions = ref()
const loaderStep = ref(-1)
const selectedVersionIpfs = ref()

onMounted(async () => {
    repositoryWithMilestones.value = await repositoryStore.fetchReviewableRepositoryMilestones(repositoryHash)
    reviews.value = await repositoryStore.getReviewsByRepository(repositoryHash)
    repositoryReviewableVersions.value = repositoryWithMilestones.value.milestones.map((milestone, index) => {
        return {
            id: index,
            commitMessage: milestone.version.commitName,
            commiter: milestone.version.comitteer,
            IPFSHash: milestone.version.ipfsHash,
            commitDate: milestone.version.timestamp * 1000,
        }
    })
    selectedVersionIpfs.value = repositoryReviewableVersions.value[repositoryReviewableVersions.value.length - 1].IPFSHash
})

const info = computed(() => {
    if (reviews.value) {
        const infoData = {
            average: 0,
            totalRates: 0,
            totalCount: 0,
            counts: [
                { rating: 1, count: 0 },
                { rating: 2, count: 0 },
                { rating: 3, count: 0 },
                { rating: 4, count: 0 },
                { rating: 5, count: 0 },
            ],
        }
        reviews.value.forEach((review) => {
            infoData.totalCount++
            infoData.counts[review.rating - 1].count++
            infoData.totalRates += review.rating
        })
        if (infoData.totalCount > 0) {
            infoData.average = infoData.totalRates / infoData.totalCount
        }
        return infoData
    } else {
        return {}
    }
})

const showCreateReview = ref(false)

const downloadRepository = () => {
    loaderStep.value = 0
    downloadFolderFromIPFS(selectedVersionIpfs.value, repositoryWithMilestones.value.name)
    setTimeout(() => {
        loaderStep.value = 1
    }, 1500)
    setTimeout(() => {
        loaderStep.value = -1
    }, 5000)
}

const triggerCreateReview = (show: boolean) => {
    showCreateReview.value = show
}

const createNewReview = async (newReview: Omit<Review, "reviewer">) => {
    reviews.value.push(await repositoryStore.createReview(newReview))
    window.location.reload()
}

const reviewToReward = reactive({
    reviewer: "",
    reviewId: -1,
    ethersAmount: 0.0,
})

const invalidEthersAmount = ref(false)

const setReward = (reviewer: string, reviewId: number) => {
    reviewToReward.reviewer = reviewer
    reviewToReward.reviewId = reviewId
    showEthersModal.value = true
}

const rewardReview = async () => {
    if (reviewToReward.ethersAmount < 0.01) {
        invalidEthersAmount.value = true
        return
    }
    invalidEthersAmount.value = false
    showEthersModal.value = false
    const reward = await repositoryStore.rewardReview(reviewToReward.reviewer, reviewToReward.reviewId, reviewToReward.ethersAmount)
    reviews.value[reviewToReward.reviewId].reward += reward
}

const changeVersion = (version: any) => {
    selectedVersionIpfs.value = version.IPFSHash
}

const downloadFile = (ipfsHash: string) => {
    downloadFileFromIPFS(ipfsHash, "review")
}
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
</style>

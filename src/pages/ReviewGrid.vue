<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8">
            <div class="lg:col-span-4">
                <h2 class="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

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
                            <dd class="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">{{ Math.round((count.count / info.totalCount === 0 ? 1 : info.totalCount) * 100) }}%</dd>
                        </div>
                    </dl>
                </div>

                <div class="mt-10">
                    <h3 class="text-lg font-medium text-gray-900">Share your thoughts</h3>
                    <p class="mt-1 text-sm text-gray-600">If you’ve used this product, share your thoughts with other customers</p>

                    <button
                        type="button"
                        class="text-center w-full flex justify-center items-center rounded-md bg-violet-700 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        @click="triggerCreateReview(true)"
                    >
                        <PencilSquareIcon class="mr-2 h-4 w-4 text-white" />
                        Add review
                    </button>
                </div>
            </div>

            <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <div class="flow-root">
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
                                </div>

                                <div class="flex h-11 justify-end items-center w-full px-6">
                                    <!--                                        class="focus:ring-none w-full group flex h-full items-center text-sm font-medium text-violet-500 hover:text-violet-800 focus:outline-none"-->

                                    <span
                                        @click="downloadFile(review.contentIdentifier)"
                                        class="text-sm group flex items space-x-2 medium text-violet-500 hover:text-violet-800 focus:outline-none"
                                    >
                                        Download review
                                        <DownloadReviewIcon class="ml-1 w-4" />
                                    </span>
                                </div>
                            </div>

                            <!--                            <div class="mt-4 space-y-6 text-base italic text-gray-600" v-html="review.content" />-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddReviewSlideOver :repository="selectedRepository" title="Add new review" :open="showCreateReview" @close="triggerCreateReview(false)" @create="createNewReview" />
    </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, StarIcon, ArrowDownTrayIcon as DownloadReviewIcon } from "@heroicons/vue/20/solid"
import { Ref, ref, computed } from "vue"
import { Review, SkillLevel } from "~/types/review"
import { useRepositoryStore } from "~/stores/repos"
import { toSvg } from "jdenticon"

const props = defineProps({
    selectedRepository: {
        type: Object,
        required: true,
    },
    reviews: {
        type: Array,
        required: true,
    },
})

const info = computed(() => {
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
    // props.reviews?.forEach((review) => {
    //     infoData.totalCount++
    //     infoData.counts[review.rating].count++
    //     infoData.totalRates += review.rating
    // })
    // if (infoData.totalCount > 0) {
    //     infoData.average = infoData.totalRates / infoData.totalCount
    //     console.log("Average: ", infoData.average)
    // }
    return infoData
})

console.log("props: ", props)

const repositoryStore = useRepositoryStore()

const showCreateReview = ref(false)
const selectedRepository = ref()

// const reviews: Ref<Array<Review>> = ref([])
const triggerCreateReview = (show: boolean) => {
    showCreateReview.value = show
}

const createNewReview = async (newReview: Omit<Review, "reviewer">) => {
    reviews.value.push(await repositoryStore.createReview(newReview))
}

const downloadFile = (ipfsHash: string) => {
    downloadFileFromIPFS(ipfsHash, "review")
}
</script>

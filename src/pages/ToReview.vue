<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Repository to review</h1>
                </div>
                <div class="mt-4 space-x-3 items-center flex sm:mt-0 sm:ml-4">
                    <button
                        v-if="selectedRepository"
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-300 px-3 py-2 text-sm font-semibold text-indigo-700 font-medium shadow-sm hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="selectedRepository = null"
                    >
                        <BackIcon class="w-4 h-4 mr-2" />
                        Show repositories
                    </button>
                    <button
                        v-if="selectedRepository"
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerCreateReview(true)"
                    >
                        Add my review
                    </button>
                </div>
            </div>
            <!-- Projects table (small breakpoint and up) -->
            <div v-if="allRepositories.length > 0 && !selectedRepository" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">Repository</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Milestone</th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Version</th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900" scope="col">Number of reviews</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr v-for="repository in allRepositories" @click="showRepoReviews(repository)" :key="repository.id" class="hover:bg-violet-100 cursor-pointer w-full h-full relative">
                                <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <span>
                                            {{ repository.title }}
                                            {{ " " }}
                                        </span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-left text-sm text-gray-500 md:table-cell">{{ repository.milestone.title }}</td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-left text-sm text-gray-500 md:table-cell">{{ repository.milestone.version.commitName }}</td>
                                <td class="px-6 py-3 text-sm font-medium text-gray-500 flex justify-center">
                                    <div class="flex transform items-center space-x-1.5 rounded-3xl py-1 px-3 w-fit duration-500 bg-violet-50 text-indigo-700 shadow-sm">
                                        <span class="rounded-3xl text-gray-600 text-sm">{{ repository.milestone.committedReviews }}/{{ repository.milestone.requiredReviews }}</span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.createdAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else-if="allRepositories.length === 0" class="flex-1 items-center justify-center h-full text-center flex flex-col">
                <div class="border rounded-md p-10 mb-10 border-dotted border-4">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <NoSymbolIcon class="h-6 w-6 text-gray-800" />
                        <span> No repositories to review</span>
                    </div>
                </div>
            </div>

            <div v-else-if="allRepositories.length > 0 && selectedRepository" class="pt-10">
                <div class="xlg:grid-cols-3 grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 md:grid-cols-3 2xl:lg:grid-cols-5 3xl:lg:grid-cols-6">
                    <div v-for="review in reviews" :key="review.contentIdentifier" class="group relative rounded-lg bg-white shadow hover:shadow-lg">
                        <div class="flex flex-col p-6 pb-16 space-y-1">
                            <div class="flex items-center truncate justify-between space-x-3">
                                <p class="text-lg w-full font-medium bg-white truncate hover:break-words hover:whitespace-normal hover:overflow-visible">{{ review.reviewer }}</p>
                                <div class="bg-gray-100 p-1 rounded-full" v-html="toSvg(review.reviewer, 25)"></div>
                            </div>

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
                            <div class="flex justify-start items-center pt-1">
                                <div>
                                    <div class="flex items-center">
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
                        <div class="absolute bottom-0 flex h-11 w-full items-center border-t px-6">
                            <a
                                :href="'https://gateway.pinata.cloud/ipfs/' + review.contentIdentifier"
                                class="focus:ring-none w-full group inline-flex flex-shrink-0 h-full items-center text-sm font-medium text-violet-500 hover:text-violet-800 focus:outline-none"
                            >
                                Download review
                                <DownloadIcon class="ml-1 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddReviewSlideOver v-if="selectedRepository" :repository="selectedRepository" title="Add new review" :open="showCreateReview" @close="triggerCreateReview(false)" @create="createNewReview" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import { ArrowUturnLeftIcon as BackIcon } from "@heroicons/vue/20/solid"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, computed, Ref, onMounted } from "vue"
import AddReviewSlideOver from "~/components/AddReviewSlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"
import { ArrowDownTrayIcon as DownloadIcon } from "@heroicons/vue/24/outline"
import { StarIcon } from "@heroicons/vue/20/solid"
import { Review, SkillLevel } from "~/types/review"
import { toSvg } from "jdenticon"
import { NoSymbolIcon } from "@heroicons/vue/20/solid"

const router = useRouter()
const repositoryStore = useRepositoryStore()

onMounted(async () => await repositoryStore.fetchReviewableRepositories())

const { toReviewRepositories } = storeToRefs(repositoryStore)
const allRepositories = computed(() => {
    return Object.values(toReviewRepositories.value).map((repository) => {
        return {
            id: repository.repositoryHash,
            title: repository.name,
            description: repository.description,
            createdAt: repository.createdAt,
            pinned: true,
            milestone: repository.milestone,
        }
    })
})
const showCreateReview = ref(false)
const selectedRepository = ref()

const reviews: Ref<Array<Review>> = ref([])
const triggerCreateReview = (show: boolean) => {
    showCreateReview.value = show
}
const showRepoReviews = async (repository) => {
    selectedRepository.value = repository
    const repositoryReviews = await repositoryStore.getReviewsByRepository(repository.id)
    if (repositoryReviews) {
        reviews.value = await Promise.all(
            repositoryReviews.map(async (review: Review) => {
                return {
                    reviewer: review.reviewer,
                    reviewerScore: await repositoryStore.getReviewerScore(review.reviewer),
                    reviewerSkillLevel: review.reviewerSkillLevel,
                    rating: review.rating,
                    contentIdentifier: review.contentIdentifier,
                }
            })
        )
        console.log("Reviews: ", reviews.value)
    }
}

const createNewReview = async (newReview: Omit<Review, "reviewer">) => {
    reviews.value.push(await repositoryStore.createReview(newReview))
}
</script>

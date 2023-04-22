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
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900" scope="col">Number of reviews</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Updated at</th>

                                <!--                                    <th class="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900" scope="col" />-->
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr v-for="repository in allRepositories" @click="showRepoReviews(repository.id)" :key="repository.id" class="hover:bg-violet-100 cursor-pointer w-full h-full relative">
                                <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <div :class="[repository.bgColorClass, 'h-2.5 w-2.5 flex-shrink-0 rounded-full']" aria-hidden="true" />
                                        <span>
                                            {{ repository.title }}
                                            {{ " " }}
                                            <span class="font-normal text-gray-500"> {{ repository.team }}</span>
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-3 text-sm font-medium text-gray-500 flex justify-center">
                                    <div class="flex transform items-center space-x-1.5 rounded-3xl py-1 px-3 w-fit duration-500 bg-violet-50 text-indigo-700 shadow-sm">
                                        <span class="rounded-3xl text-gray-600 text-sm">2/3</span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.createdAt }}</td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.updatedAt }}</td>
                            </tr>
                        </tbody>
                    </table>
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
                            <button
                                @click="downloadReview(review.contentIdentifier)"
                                type="button"
                                class="focus:ring-none w-full group inline-flex flex-shrink-0 h-full items-center text-sm font-medium text-violet-500 hover:text-violet-800 focus:outline-none"
                            >
                                Download review
                                <DownloadIcon class="ml-1 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!--            <ReviewGrid v-else-if="allRepositories.length > 0 && selectedRepository" :repository-hash="selectedRepository" />-->
            <!--            <div v-else class="flex-1 items-center justify-center h-full text-center flex flex-col">-->
            <!--                <div class="border rounded-md p-10 mb-10 border-dotted border-4">-->
            <!--                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">-->
            <!--                        <path-->
            <!--                            vector-effect="non-scaling-stroke"-->
            <!--                            stroke-linecap="round"-->
            <!--                            stroke-linejoin="round"-->
            <!--                            stroke-width="2"-->
            <!--                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"-->
            <!--                        />-->
            <!--                    </svg>-->
            <!--                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No repositories</h3>-->
            <!--                    <p class="mt-1 text-sm text-gray-500">Get started by creating a new repository.</p>-->
            <!--                    <div class="mt-6">-->
            <!--                        <button-->
            <!--                            @click="triggerCreateRepository(true)"-->
            <!--                            type="button"-->
            <!--                            class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"-->
            <!--                        >-->
            <!--                            <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />-->
            <!--                            New Repository-->
            <!--                        </button>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
        <AddReviewSlideOver :repository-hash="selectedRepository" title="Add new review" :open="showCreateReview" @close="triggerCreateReview(false)" @create="createNewReview" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import { ArrowUturnLeftIcon as BackIcon } from "@heroicons/vue/20/solid"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, computed, Ref } from "vue"
import AddReviewSlideOver from "~/components/AddReviewSlideOver.vue"
import ReviewGrid from "./ReviewGrid.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"
import { ArrowDownTrayIcon as DownloadIcon } from "@heroicons/vue/24/outline"
import { StarIcon } from "@heroicons/vue/20/solid"
import { Review, SkillLevel } from "~/types/review"
import { toSvg } from "jdenticon"

const router = useRouter()
const repositoryStore = useRepositoryStore()
const { repositories } = storeToRefs(repositoryStore)
const allRepositories = computed(() => {
    return Object.values(repositories.value).map((repository, index) => {
        return {
            id: repository.repositoryHash,
            title: repository.name,
            // initials: repository.name.slice(0, 2),
            team: repository.description,
            members: [
                {
                    name: "Dries Vincent",
                    handle: "driesvincent",
                    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                {
                    name: "Lindsay Walton",
                    handle: "lindsaywalton",
                    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                {
                    name: "Courtney Henry",
                    handle: "courtneyhenry",
                    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                {
                    name: "Tom Cook",
                    handle: "tomcook",
                    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            ],
            totalMembers: 12,
            createdAt: repository.createdAt,
            updatedAt: repository.createdAt,
            // createdAt: new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "long", timeZone: "Europe/Bratislava" }).format(repository.createdAt) as any,
            // // TODO: change created at to date related to last version
            // updatedAt: new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "long", timeZone: "Europe/Bratislava" }).format(repository.createdAt) as any,
            pinned: true,
            bgColorClass: "bg-violet-600",
        }
    })
})
const showCreateReview = ref(false)
const selectedRepository = ref()

const reviews: Ref<Array<Review>> = ref([])
const triggerCreateReview = (show: boolean) => {
    showCreateReview.value = show
}
const showRepoReviews = async (repositoryHash: string) => {
    selectedRepository.value = repositoryHash
    const repositoryReviews = await repositoryStore.getReviewsByRepository(repositoryHash)
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

    // console.log("Hash : ", repositoryHash)
    // selectedRepository.value = repositoryHash
}

const createNewReview = async (newReview: Omit<Review, "reviewer">) => {
    reviews.value.push(await repositoryStore.createReview(newReview))
}

const downloadReview = (contentIdentifier: string) => {
    console.log("Ipfs hash: ", contentIdentifier)
}
</script>

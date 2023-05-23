<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Repository to review</h1>
                    <p class="mt-2 max-w-4xl text-sm text-gray-500">
                        Discover a curated collection of repositories awaiting reviews from the community. Browse through this diverse selection of projects and contribute your expertise to help shape
                        their development and provide valuable feedback
                    </p>
                </div>
                <div v-if="selectedRepository" class="mt-4 flex space-x-4 items-center sm:mt-0 sm:ml-4">
                    <div>
                        <button
                            type="button"
                            class="order-0 inline-flex items-center rounded-md bg-violet-300 px-3 py-2 text-sm font-semibold text-indigo-700 font-medium shadow-sm hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                            @click="selectedRepository = null"
                        >
                            <BackIcon class="w-4 h-4 mr-2" />
                            Show repositories
                        </button>
                    </div>
                    <div class="inline-flex items-center space-x-4 text-right">
                        <div class="inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-violet-700 px-4 py-2 text-sm font-medium text-white shadow-sm outline-none hover:bg-violet-500"
                                @click="triggerCreateReview(true)"
                            >
                                Add review
                            </button>
                            <Menu as="div" class="relative -ml-px block">
                                <MenuButton class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-violet-700 px-2 py-2 text-sm font-medium text-white hover:bg-violet-500">
                                    <ChevronDownIcon class="h-5 w-5" />
                                </MenuButton>
                                <transition
                                    enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95"
                                >
                                    <MenuItems class="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white px-1 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <MenuItem class="flex p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-sm font-medium text-gray-700"
                                                @click="triggerCreateReview(true)"
                                            >
                                                <PencilSquareIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Add review
                                            </button>
                                        </MenuItem>
                                        <!--TODO: download whole repository-->
                                        <MenuItem class="p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-left text-sm font-medium text-gray-700"
                                                @click="triggerCreateReview(true)"
                                            >
                                                <DownloadRepositoryIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Download repository
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Projects table (small breakpoint and up) -->
            <div v-if="toReviewRepositories.length > 0 && !selectedRepository" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">Name</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Description</th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900" scope="col">
                                    Added/Required Reviews of reviewable milestones
                                </th>

                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr
                                v-for="repository in toReviewRepositories"
                                @click="redirectToReviewableRepository(repository.repositoryHash)"
                                :key="repository.id"
                                class="hover:bg-violet-100 cursor-pointer w-full h-full relative"
                            >
                                <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <span>
                                            {{ repository.name }}
                                        </span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-left text-sm text-gray-500 md:table-cell">
                                    {{ repository.description }}
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 flex justify-center text-sm text-gray-500">
                                    <div class="bg-indigo-50 w-fit rounded-xl px-3 py-0.5">
                                        {{ repository.allCommitedReviews }}
                                        /
                                        {{ repository.allRequiredReviews }}
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.createdAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else-if="toReviewRepositories.length === 0" class="flex-1 items-center justify-center h-full text-center flex flex-col">
                <div class="border rounded-md p-10 mb-10 border-dotted border-4">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <NoSymbolIcon class="h-6 w-6 text-gray-800" />
                        <span> No repositories to review</span>
                    </div>
                </div>
            </div>
            <div v-else-if="toReviewRepositories.length > 0 && selectedRepository">
                <ReviewGrid :selected-repository="selectedRepository" :reviews="reviews" />
            </div>
        </div>
    </SidebarLayout>
</template>
<script setup lang="ts">
import { ArrowUturnLeftIcon as BackIcon } from "@heroicons/vue/20/solid"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, computed, Ref, onMounted } from "vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"
import { Review } from "~/types/review"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { PencilSquareIcon, ChevronDownIcon, NoSymbolIcon, FolderArrowDownIcon as DownloadRepositoryIcon } from "@heroicons/vue/20/solid"
import ReviewGrid from "~/pages/ReviewGrid.vue"

const router = useRouter()
const repositoryStore = useRepositoryStore()

onMounted(async () => await repositoryStore.fetchReviewableRepositories())

const { toReviewRepositories } = storeToRefs(repositoryStore)

const showCreateReview = ref(false)
const selectedRepository = ref()

const reviews: Ref<Array<Review>> = ref([])
const triggerCreateReview = (show: boolean) => {
    showCreateReview.value = show
}

const redirectToReviewableRepository = (repositoryHash: string) => {
    router.push({
        path: "/toReview/" + repositoryHash,
    })
}
</script>

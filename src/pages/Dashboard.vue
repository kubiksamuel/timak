<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Owner project</h1>
                    <p class="mt-2 max-w-4xl text-sm text-gray-500">
                        Welcome to your dashboard section! Here, you'll find all the repositories that you own so you have owner-level permissions, giving you complete control to manage your
                        repositories with ease and also repositories where you own contributor-level permissions to add new versions.
                    </p>
                </div>
                <div class="mt-4 flex sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerCreateRepository(true)"
                    >
                        Create repository
                    </button>
                </div>
            </div>

            <!-- Projects table (small breakpoint and up) -->
            <div v-if="allOwnerRepositories.length > 0" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div>Owner repositories</div>
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">Name</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Description</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>

                                <!--                                    <th class="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900" scope="col" />-->
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr
                                v-for="repository in allOwnerRepositories"
                                @click="redirectToRepo(repository.id)"
                                :key="repository.id"
                                class="hover:bg-violet-100 cursor-pointer w-full h-full relative"
                            >
                                <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <span>
                                            {{ repository.title }}
                                            {{ " " }}
                                        </span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-left text-sm text-gray-500 md:table-cell">
                                    {{ repository.description }}
                                </td>

                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.createdAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!--            v-if="allContributorRepositories.length > 0"-->
            <div v-if="allContributorRepositories.length > 0" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div>Contributor repositories</div>
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">Name</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Description</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr
                                v-for="repository in allContributorRepositories"
                                @click="redirectToRepo(repository.id)"
                                :key="repository.id"
                                class="hover:bg-violet-100 cursor-pointer w-full h-full relative"
                            >
                                <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <span>
                                            {{ repository.title }}
                                            {{ " " }}
                                        </span>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-left text-sm text-gray-500 md:table-cell">
                                    {{ repository.description }}
                                </td>

                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ repository.createdAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="allOwnerRepositories?.length === 0 && allContributorRepositories.length === 0" class="flex-1 items-center justify-center h-full text-center flex flex-col">
                <div class="border rounded-md p-10 mb-10 border-dotted border-4">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                            vector-effect="non-scaling-stroke"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                    </svg>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No repositories</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by creating a new repository.</p>
                    <div class="mt-6">
                        <button
                            @click="triggerCreateRepository(true)"
                            type="button"
                            class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        >
                            <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            New Repository
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AddRepositorySlideOver title="Create new repository" :open="showCreateRepository" @create="createNewRepository" @close="triggerCreateRepository(false)" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { ref, computed, onMounted } from "vue"
import { PlusIcon } from "@heroicons/vue/20/solid"
import AddRepositorySlideOver from "~/components/AddRepositorySlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { RepositoryMeta } from "~/types/repository"

const router = useRouter()
const repositoryStore = useRepositoryStore()

onMounted(async () => {
    await repositoryStore.fetchRepositories()
})

const { repositories, account } = storeToRefs(repositoryStore)

const ownerRepositories = computed(() => Object.values(repositories.value).filter((repo) => repo.owner.toLowerCase() == account.value))

const contributorRepositories = computed(() => Object.values(repositories.value).filter((repo) => repo.owner.toLowerCase() !== account.value))

const allOwnerRepositories = computed(() => {
    return ownerRepositories.value.map((repository) => {
        return {
            id: repository.repositoryHash,
            title: repository.name,
            description: repository.description,
            createdAt: repository.createdAt,
            updatedAt: repository.createdAt,
            pinned: true,
        }
    })
})

const allContributorRepositories = computed(() => {
    return contributorRepositories.value.map((repository) => {
        return {
            id: repository.repositoryHash,
            title: repository.name,
            description: repository.description,
            createdAt: repository.createdAt,
            updatedAt: repository.createdAt,
            pinned: true,
        }
    })
})

const showCreateRepository = ref(false)

const triggerCreateRepository = (show: boolean) => (showCreateRepository.value = show)

const createNewRepository = async (newRepository: RepositoryMeta) => {
    await repositoryStore.createRepository(newRepository)
    triggerCreateRepository(false)
}

const redirectToRepo = (repositoryHash: string) => {
    router.push({
        path: "/dashboard/project/" + repositoryHash,
    })
}
</script>

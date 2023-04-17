<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Dashboard</h1>
                </div>
                <div class="mt-4 flex sm:mt-0 sm:ml-4">
                    <button
                        v-if="allRepositories.length > 0"
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerCreateRepository(true)"
                    >
                        Create
                    </button>
                </div>
            </div>

            <!-- Projects table (small breakpoint and up) -->
            <div v-if="allRepositories.length > 0" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">Project</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Members</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Updated at</th>

                                <!--                                    <th class="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900" scope="col" />-->
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr v-for="project in allRepositories" :key="project.id" class="hover:bg-violet-100 cursor-pointer">
                                <td class="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <div :class="[project.bgColorClass, 'h-2.5 w-2.5 flex-shrink-0 rounded-full']" aria-hidden="true" />
                                        <a :href="'dashboard/project/'+ project.repoHash" class="truncate hover:text-gray-600">
                                            <span>
                                                {{ project.title }}
                                                {{ " " }}
                                                <span class="font-normal text-gray-500"> {{ project.team }}</span>
                                            </span>
                                        </a>
                                    </div>
                                </td>
                                <td class="px-6 py-3 text-sm font-medium text-gray-500">
                                    <div class="flex items-center space-x-2">
                                        <div class="flex flex-shrink-0 -space-x-1">
                                            <img
                                                v-for="member in project.members"
                                                :key="member.handle"
                                                class="h-6 w-6 max-w-none rounded-full ring-2 ring-white"
                                                :src="member.imageUrl"
                                                :alt="member.name"
                                            />
                                        </div>
                                        <span v-if="project.totalMembers > project.members.length" class="flex-shrink-0 text-xs font-medium leading-5"
                                            >+{{ project.totalMembers - project.members.length }}</span
                                        >
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ project.createdAt }}</td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ project.updatedAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="flex-1 items-center justify-center h-full text-center flex flex-col">
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
        <CreateRepositorySlideOver title="Create new repository" :open="showCreateRepository" @close="triggerCreateRepository(false)" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, computed } from "vue"
import { PlusIcon } from "@heroicons/vue/20/solid"
import CreateRepositorySlideOver from "~/components/CreateRepositorySlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"

const repositoryStore = useRepositoryStore()
const { repositories } = storeToRefs(repositoryStore)
const allRepositories = computed(() => {
    return Object.values(repositories.value).map((repository, index) => {
        console.log("Repository in map: ", repository)
        return {
            id: index,
            repoHash: repository.repoHash,
            title: repository.name,
            initials: repository.name.slice(0, 2),
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
const showCreateRepository = ref(false)

const triggerCreateRepository = (show: boolean) => (showCreateRepository.value = show)
</script>

<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">{{ repository?.title }} ({{ $route.params.projectHash }})</h1>
                </div>
                <div class="mt-4 flex sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerAddVersion(true)"
                    >
                        Add version
                    </button>
                    <button
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerAddContributor(true)"
                    >
                        Add contributor
                    </button>
                </div>
            </div>
            <!-- Project files table (small breakpoint and up) -->
            <div v-if="data" class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <VersionHistoryDropdown :versions="versions" @change-version="changeVersion"></VersionHistoryDropdown>
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-t border-gray-200">
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                    <span class="lg:pl-2">File</span>
                                </th>
                                <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Size</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Created at</th>
                                <th class="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell" scope="col">Updated at</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr v-for="file in data" :key="file.id" class="hover:bg-violet-100 cursor-pointer">
                                <td class="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                    <div class="flex items-center space-x-3 lg:pl-2">
                                        <div :class="[file.bgColorClass, 'h-2.5 w-2.5 flex-shrink-0 rounded-full']" aria-hidden="true" />
                                        <a :href="'https://gateway.pinata.cloud/ipfs/' + file.fileHash" class="truncate hover:text-gray-600">
                                            <span>
                                                {{ file.title }}
                                            </span>
                                        </a>
                                    </div>
                                </td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ file.size }}</td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ file.createdAt }}</td>
                                <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ file.updatedAt }}</td>
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
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No files</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by adding a new version.</p>
                    <div class="mt-6">
                        <button
                            @click="triggerAddVersion(true)"
                            type="button"
                            class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        >
                            <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            New Version
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AddVersionSlideOver title="Add new version" folder-name="A" :open="showAddVersion" @close="triggerAddVersion(false)" />
        <AddcontributorSlideOver title="Add contributor" :open="showAddContributor" @close="triggerAddContributor(false)" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, computed, onMounted } from "vue"
import { PlusIcon } from "@heroicons/vue/20/solid"
import AddVersionSlideOver from "~/components/AddVersionSlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"

import { isProxy, toRaw } from 'vue';
const route = useRoute()
const repositoryStore = useRepositoryStore()
// const { getLatestVersion } = useRepositoryStore()
const { repositories } = storeToRefs(repositoryStore)
const repository = computed(() => {
    const r = Object.values(repositories.value).find(repo => repo.address == route.params.projectHash)
    if (!r) {
        return null
    }

    const versions: Array<Object> = []
    r.versions.forEach((version, index) => {
        const timeInSeconds=parseInt(version[0].hex,16)
        const timeInMiliseconds=timeInSeconds*1000
        const currentTime=new Date(timeInMiliseconds)
        versions.push({
            id: ++index,
            commitMessage: version[2],
            commiter: version[1],
            IPFSHash: version[3],
            commmitDate: currentTime
        })
    });

    return {
            address: r.address,
            title: r.name,
            initials: r.name.slice(0, 2),
            team: r.description,
            versions: versions,
            lastVersion: versions[versions.length-1],
            contributors: r.contributors,
            totalMembers: 12,
            createdAt: r.createdAt,
            updatedAt: r.createdAt,
            // createdAt: new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "long", timeZone: "Europe/Bratislava" }).format(repository.createdAt) as any,
            // // TODO: change created at to date related to last version
            // updatedAt: new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "long", timeZone: "Europe/Bratislava" }).format(repository.createdAt) as any,
            pinned: true,
            bgColorClass: "bg-violet-600",
        }
})

const versions = [
    {
        id: 1,
        commitMessage: "commit message1",
        commiter: "committer 1",
        IPFSHash: "QmNfN67qJW3YgT9zxJpCf4fbBg61MXCsmyauKHk7JyUFBj",
        commitDate: new Date().toISOString()
    },
    {
        id: 2,
        commitMessage: "commit message2",
        commiter: "committer 2",
        IPFSHash: "QmT7mhgAwqXdJVXaTC9tXL8vmJNR2EVcd6i4JfYM4aera2",
        commitDate: new Date().toISOString()
    },
    {
        id: 3,
        commitMessage: "commit message3",
        commiter: "committer 3",
        IPFSHash: "QmNfN67qJW3YgT9zxJpCf4fbBg61MXCsmyauKHk7JyUFBj",
        commitDate: new Date().toISOString()
    },
]

const { getLatestVersion } = useRepositoryStore()
const { latestVersion } = storeToRefs(repositoryStore)
const data = ref()
onMounted(async () => {
    console.log("Contr: ", repository.value.contributors)
    console.log("Versions: ",repository.value.versions)
    console.log("Latest version: ",repository.value.lastVersion)
    const ipfsHash = repository.value.lastVersion.IPFSHash
    await changeVersion(ipfsHash)
})

const changeVersion = async (ipfsHash) => {
    const res = await getFromIPFS(ipfsHash)
    const result: Array<Object> = []
    res.forEach((item, index) => {
        result.push({
            id: index,
            fileHash: item.fileHash,
            title: item.name,
            size: item.size,
            bgColorClass: "bg-violet-600",
            createdAt: "today",
            updatedAt: "today"
        })
    });
    data.value = result
}

const showAddVersion = ref(false)

const triggerAddVersion = (show: boolean) => (showAddVersion.value = show)

const showAddContributor = ref(false)

const triggerAddContributor = (show: boolean) => (showAddContributor.value = show)
</script>

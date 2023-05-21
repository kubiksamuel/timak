<template>
    <!-- Main column -->
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Search header -->
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">{{ repository?.title }} ({{ repositoryHash }})</h1>
                    <p class="mt-2 max-w-4xl text-sm text-gray-500">
                        The repository section is a place for managing all aspects of a project, including adding new versions, managing contributors, and creating milestones to track progress.
                    </p>
                </div>
                <div class="mt-4 flex sm:mt-0 sm:ml-4">
                    <div class="inline-flex items-center space-x-4 self-center text-right">
                        <div class="inline-flex rounded-md shadow-sm">
                            <button
                                type="button"
                                class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-violet-700 px-4 py-2 text-sm font-medium text-white shadow-sm outline-none hover:bg-violet-500"
                                @click="triggerAddVersion(true)"
                            >
                                Add version
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
                                    <MenuItems class="absolute right-0 z-10 w-40 origin-top-right rounded-md bg-white px-1 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <MenuItem class="flex p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-sm font-medium text-gray-700"
                                                @click="triggerAddVersion(true)"
                                            >
                                                <AddVersionIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Add version
                                            </button>
                                        </MenuItem>
                                        <MenuItem v-if="isOwner" class="p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-left text-sm font-medium text-gray-700"
                                                @click="triggerAddContributor(true)"
                                            >
                                                <AddContributorIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Add contributor
                                            </button>
                                        </MenuItem>
                                        <MenuItem class="p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-left text-sm font-medium text-gray-700"
                                                @click="redirectToMilestone"
                                            >
                                                <MilestoneIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Milestones
                                            </button>
                                        </MenuItem>
                                        <MenuItem class="p-1.5 hover:bg-violet-50">
                                            <button
                                                type="button"
                                                class="flex h-full w-full items-center rounded-md border-gray-300 px-1.5 text-left text-sm font-medium text-gray-700"
                                                @click="redirectToReviews"
                                            >
                                                <ReviewIcon class="mr-2 h-4 w-4 text-gray-700" />
                                                Reviews
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Project files table (small breakpoint and up) -->
            <div v-if="data" class="flex-1 mt-8 w-full pb-4 mx-auto">
                <div class="flex justify-between px-4">
                    <div class="w-full px-4 flex flex-col space-y-4">
                        <div class="flex flex-col">
                            <div class="font-medium text-sm text-gray-900">Selected version</div>
                            <div class="flex items-center justify-between space-x-4 mr-3">
                                <VersionHistoryDropdown class="w-full" v-if="repository" :versions="repository?.versions" @change-version="changeVersion"></VersionHistoryDropdown>
                                <div>
                                    <div
                                        @click="download(repository?.title)"
                                        class="whitespace-nowrap cursor-pointer text-sm group flex items space-x-2 medium text-violet-500 hover:text-violet-800 focus:outline-none transition ease-in-out delay-150 hover:scale-105 duration-300"
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

                        <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                            <table class="min-w-full">
                                <thead>
                                    <tr class="border-t border-gray-200">
                                        <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                            <span class="lg:pl-2">File</span>
                                        </th>
                                        <th class="border-b border-gray-200 bg-gray-50 whitespace-nowrap px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Size (B)</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 bg-white">
                                    <tr v-for="file in data" :key="file.id" class="hover:bg-violet-100 cursor-pointer">
                                        <td class="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                            <div class="flex items-center space-x-3 lg:pl-2">
                                                <span @click="downloadFile(file.hash)" class="truncate hover:text-gray-600">
                                                    {{ file.title }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ file.size }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="sm:flex sm:flex-col divide-y-2 divide-gray-200 w-2/3 space-y-10 px-4 hidden">
                        <div>
                            <div class="font-medium text-sm leading-6 text-gray-900 mb-1">Repository description</div>
                            <div class="text-sm text-gray-500">{{ repository.description }}</div>
                        </div>
                        <div class="pt-6">
                            <div class="font-medium leading-6 text-sm text-gray-900 mb-1">Current milestone</div>
                            <div v-if="currentMilestone">
                                <div class="relative min-w-80 overflow-hidden rounded-lg bg-white pb-12 pt-5 shadow px-4 sm:pt-6">
                                    <div class="flex justify-between items-center px-2 pb-4 space-x-10">
                                        <div>
                                            <div>
                                                <div class="truncate text-sm font-medium text-gray-500">
                                                    {{ new Date(parseFloat(currentMilestone.deadline)).toLocaleString("default", { day: "numeric" }) }}.{{
                                                        new Date(parseFloat(currentMilestone.deadline)).toLocaleString("default", { month: "numeric" })
                                                    }}.{{ new Date(parseFloat(currentMilestone.deadline)).toLocaleString("default", { year: "numeric" }) }}
                                                </div>
                                            </div>
                                            <div class="flex items-baseline">
                                                <div class="text-lg font-semibold text-gray-900">{{ currentMilestone.title }}</div>
                                                <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-1">
                                                    <button
                                                        @click="redirectToMilestone"
                                                        class="px-4 py-4 text-sm text-left cursor-pointer h-full w-full font-medium text-violet-700 hover:text-indigo-500"
                                                    >
                                                        View all milestones
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inline-flex h-fit items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-200">
                                            <svg class="h-1.5 w-1.5 fill-violet-800" viewBox="0 0 6 6" aria-hidden="true">
                                                <circle cx="3" cy="3" r="3" />
                                            </svg>
                                            In progress
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-500">
                                No milestone in progress.
                                <p v-if="isOwner">
                                    <button class="underline text-violet-500" @click="redirectToMilestone">Set your milestone</button>
                                    to track the progress
                                </p>
                            </div>
                        </div>
                        <div class="pt-6">
                            <div class="font-medium text-sm leading-6 text-gray-900 mb-1">Contributors</div>
                            <ContributorsTable :commiter-id="currentVersion.commiter.id" title="Show contributors" />
                        </div>
                    </div>
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
        <AddVersionSlideOver
            title="Add new version"
            :repository-address="repository?.address"
            :folder-name="repository?.title"
            :open="showAddVersion"
            @close="triggerAddVersion(false)"
            @change-version="$forceUpdate()"
        />
        <AddContributorSlideOver title="Add contributor" :open="showAddContributor" @close="triggerAddContributor(false)" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { storeToRefs } from "pinia"
import { ref, onMounted } from "vue"
import AddVersionSlideOver from "~/components/AddVersionSlideOver.vue"
import AddContributorSlideOver from "~/components/AddContributorSlideOver.vue"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import {
    PlusIcon,
    ChevronDownIcon,
    UserPlusIcon as AddContributorIcon,
    FolderPlusIcon as AddVersionIcon,
    ArrowDownTrayIcon as DownloadRepositoryIcon,
    CalendarIcon as MilestoneIcon,
    StarIcon as ReviewIcon,
} from "@heroicons/vue/20/solid"

import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const repositoryStore = useRepositoryStore()

const { repositories, account } = storeToRefs(repositoryStore)

const repository = ref()
const data = ref()
const currentMilestone = ref()
const currentVersion = ref()
const loaderStep = ref(-1)
const isOwner = ref()

const repositoryHash = route.params.projectHash

onMounted(async () => {
    const r = Object.values(repositories.value).find((repo) => repo.repositoryHash == repositoryHash)
    if (r) {
        const versions: Array<Object> = []
        await Promise.all(
            r.versions.map(async (version, index) => {
                const timestamp = Number.isNaN(parseInt(version[0].hex, 16)) ? version[0]?.toNumber() : parseInt(version[0].hex, 16)
                const timeInMiliseconds = timestamp * 1000
                versions.push({
                    id: ++index,
                    commitMessage: version[2],
                    commiter: await repositoryStore.getContributorData(version[1], repositoryHash),
                    IPFSHash: version[3],
                    commitDate: timeInMiliseconds,
                })
            })
        )
        isOwner.value = account.value.toLowerCase() === r.owner.toLowerCase()
        repository.value = {
            owner: r.owner,
            address: r.repositoryHash,
            title: r.name,
            initials: r.name.slice(0, 2),
            description: r.description,
            versions: versions,
            lastVersion: versions[versions.length - 1],
            contributors: r.contributors,
            totalMembers: 12,
            createdAt: r.createdAt,
            updatedAt: r.createdAt,
            pinned: true,
        }
        if (repository.value.lastVersion) {
            await changeVersion(repository.value.lastVersion)
        }

        const milestones = await repositoryStore.getMilestones(repositoryHash)
        currentMilestone.value = milestones.find((milestone) => !milestone.completed)
    }
})

const changeVersion = async (selectedVersion) => {
    console.log("ipfs: ", selectedVersion)
    const res = await getFolderFromIPFS(selectedVersion.IPFSHash)
    const result: Array<Object> = []
    res.forEach((item, index) => {
        result.push({
            id: index,
            hash: item.hash,
            title: item.name,
            size: item.size,
        })
    })
    data.value = result
    currentVersion.value = selectedVersion
}

const download = (folderName: string) => {
    loaderStep.value = 0
    downloadFolderFromIPFS(currentVersion.value.IPFSHash, folderName)
    setTimeout(() => {
        loaderStep.value = 1
    }, 1500)
    setTimeout(() => {
        loaderStep.value = -1
    }, 5000)
}

const downloadFile = (ipfsHash: string) => {
    const index = ipfsHash.lastIndexOf("/")
    const extractedName = ipfsHash.slice(index + 1, ipfsHash.length)
    downloadFileFromIPFS(ipfsHash, extractedName)
}

const showAddVersion = ref(false)

const triggerAddVersion = (show: boolean) => (showAddVersion.value = show)

const showAddContributor = ref(false)

const triggerAddContributor = (show: boolean) => (showAddContributor.value = show)

const redirectToMilestone = async () => await router.push({ path: repositoryHash + "/milestones" })

const redirectToReviews = async () => await router.replace({ path: "/toReview/" + repositoryHash })
</script>

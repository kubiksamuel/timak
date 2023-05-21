<template>
    <div>
        <SidebarLayout>
            <div class="flex flex-col min-h-screen">
                <!-- Page title & actions -->
                <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div class="min-w-0 flex-1">
                        <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Milestones</h1>
                        <p class="mt-2 max-w-4xl text-sm text-gray-500">
                            Stay up-to-date with your project's progress by checking out dynamic timeline section, where you can view all the significant milestones and achievements in chronological
                            order.
                            {{ isOwner }}
                        </p>
                    </div>
                    <div class="mt-4 flex sm:mt-0 sm:ml-4">
                        <router-link :to="'/dashboard/project/' + route.params.projectHash">
                            <div
                                class="order-0 inline-flex items-center rounded-md bg-violet-300 px-3 py-2 text-sm font-semibold text-indigo-700 font-medium shadow-sm hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                            >
                                <BackIcon class="w-4 h-4 mr-2" />
                                Back to repository
                            </div>
                        </router-link>
                        <button
                            type="button"
                            v-if="isOwner"
                            class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                            @click="triggerAddMilestone(true)"
                        >
                            Add milestone
                        </button>
                    </div>
                </div>
                <div v-if="milestones?.length" class="pt-3 font-poppins">
                    <div class="flex flex-col items-center pt-2">
                        <h1 class="text-5xl font-bold leading-tight">Milestone <span class="text-violet-500"> Timeline </span></h1>
                        <div class="flex w-24 mt-1 mb-6 overflow-hidden rounded">
                            <div class="flex-1 h-2 bg-violet-200"></div>
                            <div class="flex-1 h-2 bg-violet-400"></div>
                            <div class="flex-1 h-2 bg-violet-600"></div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center py-8">
                        <div class="w-full mx-auto lg:max-w-5xl">
                            <div class="relative">
                                <div class="absolute hidden w-1 h-full transform -translate-x-1/2 bg-[#c9e2f5] dark:bg-gray-700 lg:block left-1/2"></div>
                                <div class="space-y-2 lg:space-y-4">
                                    <div v-for="(milestone, index) in milestones" :key="milestone.id">
                                        <div class="flex flex-col items-center">
                                            <div class="flex items-center w-full mx-auto" :class="[index % 2 === 0 ? 'justify-start' : 'justify-end']">
                                                <div class="w-full lg:w-1/2" :class="[index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8']">
                                                    <div class="relative flex-1 mb-10 bg-white rounded-lg shadow-lg hover:shadow-xl lg:mb-8">
                                                        <div class="absolute inline-block w-4 overflow-hidden -translate-y-1/2" :class="[index % 2 === 0 ? 'top-3 -right-4' : 'top-7 -left-4']">
                                                            <div
                                                                class="h-10 transform -rotate-45 bg-white shadow-md lg:block"
                                                                :class="[index % 2 === 0 ? 'origin-bottom-left' : 'origin-top-right']"
                                                            ></div>
                                                        </div>
                                                        <div class="relative z-20">
                                                            <div class="flex items-center">
                                                                <div class="p-4 md:w-1/4">
                                                                    <span class="text-lg font-medium text-gray-500"
                                                                        >{{ new Date(parseFloat(milestone.deadline)).toLocaleString("default", { month: "long" }) }}
                                                                    </span>
                                                                    <p class="text-xl font-bold text-gray-700 text-bold">
                                                                        {{ new Date(parseFloat(milestone.deadline)).toLocaleString("default", { day: "numeric" }) }}
                                                                    </p>
                                                                    <span class="text-lg font-medium text-gray-500">
                                                                        {{ new Date(parseFloat(milestone.deadline)).toLocaleString("default", { year: "numeric" }) }}
                                                                    </span>
                                                                </div>
                                                                <div class="flex-1 p-4 pr-4 border-l border-gray-300">
                                                                    <div class="flex justify-between items-center h-full">
                                                                        <p class="mb-2 text-xl font-bold text-gray-700">{{ milestone.title }}</p>
                                                                        <span
                                                                            v-if="milestone.completed"
                                                                            class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-200"
                                                                        >
                                                                            <svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                                                                                <circle cx="3" cy="3" r="3" />
                                                                            </svg>
                                                                            Completed
                                                                        </span>

                                                                        <span
                                                                            v-else-if="(!milestone.completed && index === 0) || (index > 0 && milestones[index - 1].completed)"
                                                                            class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-200"
                                                                        >
                                                                            <svg class="h-1.5 w-1.5 fill-violet-800" viewBox="0 0 6 6" aria-hidden="true">
                                                                                <circle cx="3" cy="3" r="3" />
                                                                            </svg>
                                                                            In progress
                                                                        </span>
                                                                        <span
                                                                            v-else
                                                                            class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-200"
                                                                        >
                                                                            <svg class="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                                                                                <circle cx="3" cy="3" r="3" />
                                                                            </svg>
                                                                            Awaiting
                                                                        </span>
                                                                    </div>
                                                                    <div class="flex justify-between items-center flex-wrap">
                                                                        <p class="text-gray-500 hyphens-auto">
                                                                            {{ milestone.description }}
                                                                        </p>
                                                                        <button
                                                                            v-if="(!milestone.completed && index === 0) || (!milestone.completed && index > 0 && milestones[index - 1].completed)"
                                                                            type="button"
                                                                            class="order-0 inline-flex items-center px-2 py-1 justify-between rounded-md text-sm underline font-semibold text-violet-700 hover:text-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                                                                            @click="triggerCompleteMilestone(true, milestone.id)"
                                                                        >
                                                                            Complete
                                                                        </button>
                                                                        <div v-else-if="milestone.completed" class="text-gray-400 text-right text-xs truncate w-28">
                                                                            {{ milestone.versionCommitName }}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="absolute shadow-lg hover:shadow-xl flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-4 bg-violet-200 rounded-full left-1/2 lg:translate-y-[2px]"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex-1 items-center justify-center h-full text-center flex flex-col">
                    <div class="border rounded-md p-10 mb-10 border-dotted border-4">
                        <h3 class="mt-2 text-sm font-semibold text-gray-900">No milestones</h3>
                        <p v-if="isOwner" class="mt-1 text-sm text-gray-500">Set the first milestone to track the progress!</p>
                        <div class="mt-6">
                            <button
                                v-if="isOwner"
                                @click="triggerAddMilestone(true)"
                                type="button"
                                class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                            >
                                <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                Add milestone
                            </button>
                        </div>
                    </div>
                </div>
                <AddMilestoneSlideOver title="Add milestone" :min-date="minDate" :open="showAddMilestone" @create="createMilestone" @close="triggerAddMilestone(false)" />
                <CompleteMilestoneModal :open="showCompleteMilestone" @complete="completeMilestone" @close="triggerCompleteMilestone(false)" />
                <MilestoneFailModal :open="showFailModal" @close="triggerFailModal(false)" />
            </div>
        </SidebarLayout>
    </div>
</template>
<script setup lang="ts">
import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { MilestoneMeta } from "~/types/milestone"
import CompleteMilestoneModal from "~/components/CompleteMilestoneModal.vue"
import AddMilestoneSlideOver from "~/components/AddMilestoneSlideOver.vue"
import MilestoneFailModal from "~/components/MilestoneFailModal.vue"
import { ArrowUturnLeftIcon as BackIcon } from "@heroicons/vue/20/solid"
import { PlusIcon } from "@heroicons/vue/20/solid"
import { storeToRefs } from "pinia"

const route = useRoute()
const repositoryStore = useRepositoryStore()
const { account } = storeToRefs(repositoryStore)
const milestones = ref()
const progressMilestoneId = ref()
const showAddMilestone = ref(false)
const showCompleteMilestone = ref(false)
const showFailModal = ref(false)
const latestRepositoryVersionHash = ref()
const isOwner = ref()
const minDate = ref(new Date())

const repositoryHash = route.params.projectHash

onMounted(async () => {
    milestones.value = await repositoryStore.getMilestones(repositoryHash)
    if (milestones.value.length) {
        minDate.value = new Date(milestones.value[milestones.value.length - 1].deadline)
    }
    isOwner.value = account.value.toLowerCase() === (await repositoryStore.getRepositoryByHash(repositoryHash)).owner.toLowerCase()
    latestRepositoryVersionHash.value = await repositoryStore.getLastVersionHashOfRepository(repositoryHash)
})

const triggerAddMilestone = (show: boolean) => (showAddMilestone.value = show)

const triggerFailModal = (show: boolean) => {
    showFailModal.value = show
}
const triggerCompleteMilestone = (show: boolean, milestoneId?: number) => {
    if (milestoneId > 0) {
        if (milestones.value[milestoneId - 1].versionHash === latestRepositoryVersionHash.value) {
            triggerFailModal(true)
            return
        }
        progressMilestoneId.value = milestoneId
    }
    showCompleteMilestone.value = show
}

const createMilestone = async (newMilestone: MilestoneMeta) => {
    newMilestone.deadline = new Date(newMilestone.deadline).getTime()
    await repositoryStore.createMilestone(newMilestone, route.params.projectHash)
    window.location.reload()
}

const completeMilestone = async (numberOfReviews: number) => {
    if (await repositoryStore.completeMilestone(route.params.projectHash, progressMilestoneId.value, numberOfReviews)) {
        milestones.value[progressMilestoneId.value].completed = true
    }
}
</script>

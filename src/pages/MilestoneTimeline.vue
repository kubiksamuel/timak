<template>
    <SidebarLayout>
        <div class="flex flex-col min-h-screen">
            <!-- Page title & actions -->
            <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div class="min-w-0 flex-1">
                    <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">Milestones</h1>
                </div>
                <div class="mt-4 flex sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        class="order-0 inline-flex items-center rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:order-1 sm:ml-3"
                        @click="triggerAddMilestone(true)"
                    >
                        Add milestone
                    </button>
                </div>
            </div>
            <div class="py-10 font-poppins">
                <div class="max-w-xl mx-auto">
                    <div class="text-center">
                        <p class="mb-16 text-base text-center text-gray-500">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus magni eius eaque? Pariatur numquam, odio quod nobis ipsum ex cupiditate?
                        </p>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <div class="w-full px-4 mx-auto lg:max-w-5xl">
                        <div class="relative">
                            <div class="absolute hidden w-1 h-full transform -translate-x-1/2 bg-[#c9e2f5] dark:bg-gray-700 lg:block left-1/2"></div>
                            <div class="space-y-2 lg:space-y-4">
                                <!--                                &lt;!&ndash; Right section &ndash;&gt;-->
                                <!--                                <div>-->
                                <!--                                    <div class="flex flex-col items-center">-->
                                <!--                                        <div class="flex items-center justify-end w-full mx-auto">-->
                                <!--                                            <div class="w-full lg:w-1/2 lg:pl-8">-->
                                <!--                                                <div class="relative flex-1 mb-10 bg-white rounded shadow lg:mb-8 dark:bg-gray-900">-->
                                <!--                                                    <div class="absolute inline-block w-4 overflow-hidden -translate-y-1/2 top-7 -left-4">-->
                                <!--                                                        <div class="hidden h-10 origin-top-right transform -rotate-45 bg-white dark:bg-gray-900 lg:block drop-shadow-lg"></div>-->
                                <!--                                                    </div>-->
                                <!--                                                    <div class="relative z-20">-->
                                <!--                                                        <div class="flex flex-wrap items-center">-->
                                <!--                                                            <div class="p-4 md:w-1/4">-->
                                <!--                                                                <span class="text-lg text-gray-700 dark:text-gray-400">February</span>-->
                                <!--                                                                <p class="text-2xl font-bold text-gray-700 dark:text-gray-400 text-bold">02</p>-->
                                <!--                                                                <span class="text-lg text-gray-700 dark:text-gray-400">2020</span>-->
                                <!--                                                            </div>-->
                                <!--                                                            <div class="flex-1 p-4 pr-4 border-l border-gray-300 dark:border-gray-700">-->
                                <!--                                                                <p class="mb-2 text-xl font-bold text-gray-600 dark:text-gray-400">Website Launched</p>-->
                                <!--                                                                <p class="text-gray-700 dark:text-gray-500">-->
                                <!--                                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. veniam libero facilis minus reprehenderit.-->
                                <!--                                                                </p>-->
                                <!--                                                            </div>-->
                                <!--                                                        </div>-->
                                <!--                                                    </div>-->
                                <!--                                                </div>-->
                                <!--                                            </div>-->
                                <!--                                        </div>-->
                                <!--                                        <div-->
                                <!--                                            class="absolute flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-4 bg-blue-500 rounded-full dark:bg-gray-700 left-1/2 lg:translate-y-[3px]"-->
                                <!--                                        >-->
                                <!--                                            <span class="text-gray-100 dark:text-gray-400">-->
                                <!--                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4 bi bi-globe" viewBox="0 0 16 16">-->
                                <!--                                                    <path-->
                                <!--                                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"-->
                                <!--                                                    ></path>-->
                                <!--                                                </svg>-->
                                <!--                                            </span>-->
                                <!--                                        </div>-->
                                <!--                                    </div>-->
                                <!--                                </div>-->
                                <!-- Left section -->
                                <div v-for="(milestone, index) in milestones" :key="milestone.id">
                                    <div class="flex flex-col items-center">
                                        <!--                                        justify-start-->
                                        <div class="flex items-center w-full mx-auto" :class="[index % 2 === 0 ? 'justify-start' : 'justify-end']">
                                            <!--                                            lg:pl-8-->
                                            <div class="w-full lg:w-1/2" :class="[index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8']">
                                                <div class="relative flex-1 mb-10 bg-white rounded-lg shadow-lg hover:shadow-xl lg:mb-8">
                                                    <!--                                                    top-3 -right-4-->
                                                    <!--                                                    <div class="absolute inline-block w-4 overflow-hidden -translate-y-1/2 top-3 -right-4">-->
                                                    <!--                                                        <div class="h-10 origin-bottom-left transform -rotate-45 bg-white shadow lg:block dark:bg-gray-900"></div>-->
                                                    <!--                                                    </div>-->
                                                    <div class="absolute inline-block w-4 overflow-hidden -translate-y-1/2" :class="[index % 2 === 0 ? 'top-3 -right-4' : 'top-7 -left-4']">
                                                        <div class="h-10 transform -rotate-45 bg-white shadow-md lg:block" :class="[index % 2 === 0 ? 'origin-bottom-left' : 'origin-top-right']"></div>
                                                    </div>
                                                    <div class="relative z-20">
                                                        <div class="flex flex-wrap items-center">
                                                            <div class="p-4 md:w-1/4">
                                                                <span class="text-lg text-gray-500">March</span>
                                                                <p class="text-2xl font-bold text-gray-500 text-bold">11</p>
                                                                <span class="text-lg text-gray-500">2021</span>
                                                            </div>
                                                            <div class="flex-1 p-4 pr-4 border-l border-gray-300">
                                                                <p class="mb-2 text-xl font-bold text-gray-700">{{ milestone.title }}</p>
                                                                <p class="text-gray-500">
                                                                    {{ milestone.description }}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="absolute shadow-lg hover:shadow-xl flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-4 bg-indigo-300 rounded-full left-1/2 lg:translate-y-[2px]"
                                        ></div>
                                    </div>
                                </div>
                                <!-- Right section -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--            <div class="w-full justify-center max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">-->
            <!--                <div class="w-full lg:max-w-3xl">-->
            <!--                    <div v-for="milestone in milestones" :key="milestone.id" class="relative w-full flex">-->
            <!--                        <div class="flex flex-col items-center w-10 mr-4 md:w-24">-->
            <!--                            <div>-->
            <!--                                <div class="flex items-center justify-center w-8 h-8 bg-violet-500 rounded-full">-->
            <!--                                    <div class="w-4 h-4 bg-white rounded-full"></div>-->
            <!--                                </div>-->
            <!--                            </div>-->
            <!--                            <div class="w-0.5 h-full bg-gray-400"></div>-->
            <!--                        </div>-->
            <!--                        <div class="w-full">-->
            <!--                            <h2 class="inline-block px-4 py-2 mb-4 text-xs font-medium text-gray-100 bg-gradient-to-r from-violet-400 to-violet-600 rounded-3xl dark:text-gray-100">January 2002</h2>-->
            <!--                            <div class="relative flex-1 mb-10 bg-white shadow-md hover:shadow-lg rounded-lg">-->
            <!--                                <div class="relative z-20 p-6 flex justify-between items-center">-->
            <!--                                    <div>-->
            <!--                                        <p class="mb-2 text-xl font-medium text-gray-700">{{ milestone.title }}</p>-->
            <!--                                        <p class="text-gray-500">{{ milestone.description }}</p>-->
            <!--                                    </div>-->
            <!--                                    <span class="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">-->
            <!--                                        <svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">-->
            <!--                                            <circle cx="3" cy="3" r="3" />-->
            <!--                                        </svg>-->
            <!--                                        Badge-->
            <!--                                    </span>-->
            <!--                                </div>-->
            <!--                            </div>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
        <AddMilestone title="Add milestone" :open="showAddMilestone" @create="createMilestone" @close="triggerAddMilestone(false)" />
    </SidebarLayout>
</template>
<script setup lang="ts">
import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"
import { ref, onMounted, watch } from "vue"
import SidebarLayout from "../layouts/SidebarLayout.vue"
import { MilestoneMeta } from "~/types/milestone"

const props = defineProps({
    repositoryHash: {
        type: String,
        required: true,
    },
})

const route = useRoute()
const repositoryStore = useRepositoryStore()
const milestones = ref()
const showAddMilestone = ref(false)

onMounted(async () => {
    console.log("Hash: ", route.params.projectHash)
    milestones.value = await repositoryStore.getMilestones(route.params.projectHash)
    console.log("Milestones: ", milestones.value)
})

const triggerAddMilestone = (show: boolean) => (showAddMilestone.value = show)

const createMilestone = async (newMilestone: MilestoneMeta) => {
    console.log("New milestone: ", route.params.projectHash)
    milestones.value.push(await repositoryStore.createMilestone(newMilestone, route.params.projectHash))
}
</script>

<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Title</label>
                        <div class="mt-1">
                            <input
                                v-model="newMilestone.title"
                                type="text"
                                name="title"
                                id="title"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Title"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Description</label>
                        <div class="mt-1">
                            <input
                                v-model="newMilestone.description"
                                type="text"
                                name="description"
                                id="description"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Description"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Finish deadline</div>
                        <div class="mt-1">
                            <VueDatePicker v-model="newMilestone.deadline" :min-date="new Date()" :enable-time-picker="false" />
                        </div>
                    </div>
                    <!--                    Switch can be used in add review slide over-->
                    <!--                    <div class="flex items-center space-x-10">-->
                    <!--                        <div class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Request review after finish:</div>-->
                    <!--                        <Switch-->
                    <!--                            v-model="newMilestone.requestReview"-->
                    <!--                            :class="newMilestone.requestReview ? 'bg-indigo-600' : 'bg-gray-300'"-->
                    <!--                            class="relative inline-flex h-[32px] w-[75px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"-->
                    <!--                        >-->
                    <!--                            <span-->
                    <!--                                aria-hidden="true"-->
                    <!--                                :class="newMilestone.requestReview ? 'translate-x-11' : 'translate-x-0'"-->
                    <!--                                class="pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"-->
                    <!--                            />-->
                    <!--                        </Switch>-->
                    <!--                    </div>-->
                </div>
            </div>
            <hr class="-mx-6" />
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="emit('create', newMilestone)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Add milestone
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import SlideOver from "./SlideOver.vue"
import { MilestoneMeta } from "~/types/milestone"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
})
const emit = defineEmits<{
    (e: "close"): void
    (e: "create", newMilestone: MilestoneMeta): void
}>()

const newMilestone: Ref<MilestoneMeta> = ref({
    title: "",
    description: "",
    requestReview: false,
    deadline: 0,
})
</script>

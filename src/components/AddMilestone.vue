<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex flex-col space-y-2">
            <div>
                <label for="address" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Title</label>
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
                <label for="address" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Description</label>
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

            <div class="py-16">
                <Switch
                    v-model="enabled"
                    :class="enabled ? 'bg-teal-900' : 'bg-teal-700'"
                    class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    <span class="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    />
                </Switch>
            </div>

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="addMilestone(newMilestone)"
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
import { Switch } from "@headlessui/vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { MilestoneMeta } from "~/types/milestone"

const { addMilestone } = useRepositoryStore()

defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})

const enabled = ref(false)

const emit = defineEmits<{
    (e: "close"): void
}>()

const newMilestone: Ref<MilestoneMeta | {}> = ref({})
</script>

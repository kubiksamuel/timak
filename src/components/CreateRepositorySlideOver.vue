<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-2">
                    <div>
                        <label for="name" class="ml-px block text-sm font-medium leading-6 text-gray-900">Name</label>
                        <div class="mt-1">
                            <input
                                v-model="newRepository.name"
                                type="text"
                                name="name"
                                id="name"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Name"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="description" class="ml-px block text-sm font-medium leading-6 text-gray-900">Description</label>
                        <div class="mt-1">
                            <input
                                v-model="newRepository.description"
                                type="text"
                                name="description"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Description"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="createRepository(newRepository)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                    Create repository
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { RepositoryMeta } from "~/types/repository"

const { createRepository } = useRepositoryStore()

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
}>()

const newRepository: Ref<RepositoryMeta | {}> = ref({})
</script>

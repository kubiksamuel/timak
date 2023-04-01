<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="col-span-6 sm:col-span-3">
            <label for="repository-name" class="block text-sm font-bold leading-6 text-gray-900">Repository name:</label>
            <input
                v-model="newRepository.name"
                type="text"
                name="repository-name"
                id="first-name"
                autocomplete="given-name"
                class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
        </div>
        <div>
            <label for="description" class="block text-sm font-bold leading-6 text-gray-900">Description:</label>
            <div class="mt-2">
                <textarea
                    v-model="newRepository.description"
                    id="description"
                    name="about"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    placeholder="you@example.com"
                />
            </div>
        </div>
        <div class="px-4 py-3 text-right sm:px-6">
            <button
                @click="createRepository(newRepository)"
                class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
                Create repository
            </button>
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

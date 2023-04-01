<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="col-span-6 sm:col-span-3">
            <label for="repository-name" class="block text-sm font-bold leading-6 text-gray-900">Repository name:</label>
            <input type="text" name="repository-name" id="first-name" autocomplete="given-name" class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
        </div>
        <div>
            <label for="description" class="block text-sm font-bold leading-6 text-gray-900">Description:</label>
            <div class="mt-2">
                <textarea id="description" name="about" rows="3" class="mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6" placeholder="you@example.com" />
            </div>
        </div>
        <div class="col-span-6 sm:col-span-3">
            <label for="security" class="block text-sm font-bold leading-6 text-gray-900">Security:</label>
            <select id="security" name="security" autocomplete="security" class="mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option>Public</option>
            <option>Private</option>
            </select>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button type="submit" class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Create repository</button>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import SlideOver from "./SlideOver.vue"

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
</script>

<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex flex-col space-y-2">
            <div>
                <label for="File" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">File</label>
                <div class="mt-1">
                    <input
                        v-on:change="handleFileUpload($event)"
                        type="file"
                        name="File"
                        class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="File"
                        ref="newFile"
                    />
                </div>
            </div>

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="createFile(newFile)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Add file
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import SlideOver from "./SlideOver.vue"


const createFile = (file: File | null) => {
    console.log(file)
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files) {
        newFile.value = target.files[0]
    }
}

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

let newFile: Ref<File | null> = ref(null)
</script>

<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title" :folder-name="folderName">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <label for="commitMessage" class="ml-px block text-sm font-medium leading-6 text-gray-900">Commit message</label>
                        <div class="mt-1">
                            <input
                                v-model="commitMessage"
                                type="text"
                                name="commitMessage"
                                id="commitMessage"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Commit message"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="ml-px block text-sm font-medium leading-10 text-gray-900">Review Document</div>
                        <label
                            for="dropzone-file"
                            class="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed hover:border-violet-500 rounded-lg cursor-pointer bg-white"
                            :class="{ 'border-violet-400': hasUploaded }"
                        >
                            <div v-if="hasUploaded" class="flex space-x-2 justify-center items-center text-gray-500">
                                <div class="text-sm">
                                    <span class="underline">
                                        {{ Object.values(files)[0].name }}
                                    </span>
                                    <span> and other files were selected </span>
                                </div>
                                <CheckCircleIcon class="h-5 w-5 text-violet-600" aria-hidden="true" />
                            </div>
                            <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Your review will be uploaded to ipfs.</p>
                            </div>
                            <input @change="handleFolderToUpload($event)" webkitdirectory multiple id="dropzone-file" type="file" class="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="createVersion(commitMessage, files, folderName)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Create new version
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from "vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"
import { addFolderToIPFS } from "~/composables/ipfs"
import { CheckCircleIcon } from "@heroicons/vue/20/solid"

const { addVersionOfRepository } = useRepositoryStore()
const route = useRoute()

const files: Ref<FileList | undefined> = ref()
const commitMessage: Ref<string | undefined> = ref()

const hasUploaded = computed(() => files.value && Object.values(files.value).length)
const createVersion = async (commitMessage: string | undefined, files: FileList | undefined, folderName: string) => {
    console.log("Commit message: ", commitMessage)
    console.log("Committed files: ", files)
    console.log("Folder name: ", folderName)
    let hash = "blbost"
    if (commitMessage && files) {
        hash = await addFolderToIPFS(files, folderName)
    }
    await addVersionOfRepository(route.params.projectHash, hash, commitMessage)
    window.location.reload()
}

const handleFolderToUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files) {
        files.value = target.files
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
    folderName: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: "close"): void
}>()
</script>

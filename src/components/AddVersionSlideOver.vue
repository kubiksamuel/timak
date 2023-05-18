<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title" :folder-name="folderName" :repository-address="repositoryAddress">
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
                        <div class="ml-px block text-sm font-medium leading-10 text-gray-900">Files</div>
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
                                <p class="text-xs text-gray-500 dark:text-gray-400">Files will be uploaded to ipfs.</p>
                            </div>
                            <input @change="handleFolderToUpload($event)" webkitdirectory multiple id="dropzone-file" type="file" class="hidden" />
                        </label>
                    </div>
                </div>
                <div v-if="currentLoaderStep >= 0" class="items-center flex justify-center py-20">
                    <ul class="max-w-md space-y-2 text-gray-500 list-inside">
                        <li class="flex items-center">
                            <div v-if="currentLoaderStep === 0">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <div v-else-if="currentLoaderStep < 0">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="gray-200"
                                    />
                                </svg>
                            </div>
                            <div v-else>
                                <svg aria-hidden="true" class="w-5 h-5 mr-1.5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <span class="text-gray-400">Preparing your files</span>
                        </li>
                        <li class="flex items-center">
                            <div v-if="currentLoaderStep === 1">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <div v-else-if="currentLoaderStep < 1">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="gray-200"
                                    />
                                </svg>
                            </div>
                            <div v-else>
                                <svg aria-hidden="true" class="w-5 h-5 mr-1.5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <span class="text-gray-400"> Uploading files to ipfs</span>
                        </li>
                        <li class="flex items-center">
                            <div v-if="currentLoaderStep === 2">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <div v-else-if="currentLoaderStep < 2">
                                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="gray-200"
                                    />
                                </svg>
                            </div>
                            <div v-else>
                                <svg aria-hidden="true" class="w-5 h-5 mr-1.5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <span class="text-gray-400"> Preparing transactions </span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr class="-mx-6" />

            <div class="px-4 py-3 flex justify-end sm:px-6">
                <button
                    @click="createVersion(commitMessage, files, folderName, repositoryAddress)"
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

const currentLoaderStep = ref(-1)

const hasUploaded = computed(() => files.value && Object.values(files.value).length)

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
const createVersion = async (commitMessage: string | undefined, files: FileList | undefined, folderName: string, repositoryAddress: string) => {
    currentLoaderStep.value = 0
    let hash = "invalid"
    setTimeout(() => (currentLoaderStep.value = 1), 1200)
    if (commitMessage && files) {
        hash = await addFolderToIPFS(files, repositoryAddress)
        await sleep(1200)
        currentLoaderStep.value = 2
        await sleep(1200)
        currentLoaderStep.value = 3
        await sleep(1200)
        await addVersionOfRepository(route.params.projectHash, hash, commitMessage)
        window.location.reload()
    } else {
        currentLoaderStep.value = -1
    }
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
    repositoryAddress: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: "close"): void
}>()
</script>

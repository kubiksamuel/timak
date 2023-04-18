<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title" :folderName="folderName">
        <div class="flex flex-col space-y-2">
            <div>
                <label for="commitMessage" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Commit message</label>
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
                <label for="Folder" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Folder</label>
                <div class="mt-1">
                    <input
                        v-on:change="handleFolderToUpload($event)"
                        type="file"
                        name="Folder"
                        class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Folder"
                        ref="files"
                        webkitdirectory multiple
                    />
                </div>
            </div>

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="createVersion(commitMessage, files, folderName)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Create new version
                </button>
            </div>
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="addVersionOfRepository($route.params.projectHash, 'ipfs hash', 'add function')"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Add versions
                </button>
            </div>
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="getVersionsOfRepository($route.params.projectHash)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Get versions
                </button>
            </div>
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="getLatestVersion($route.params.projectHash)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Get latest version
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useRoute } from "vue-router"

const { addVersionOfRepository, getVersionsOfRepository, getLatestVersion } = useRepositoryStore()
const route = useRoute()

const createVersion = async (commitMessage: string | undefined, files: FileList | undefined, folderName: string) => {
    console.log(commitMessage, files)
    let hash: string = "blbost"
    if (commitMessage && files) {
        hash = await addToIPFS(files, folderName)
    }
    addVersionOfRepository(route.params.projectHash, hash, commitMessage)
    console.log(hash)
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

let files: Ref<FileList | undefined> = ref()
const commitMessage: Ref<string | undefined> = ref()
</script>

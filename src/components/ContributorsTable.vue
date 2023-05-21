<template>
    <div>
        <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
            <table class="min-w-full">
                <thead>
                    <tr class="border-t border-gray-200">
                        <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Name</th>
                        <th class="hidden 2xl:table-cell border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Address</th>
                        <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Identicon</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    <tr v-for="contributor in repositoryCon.contributors" :class="{ 'bg-violet-100': contributor.id === commiterId }">
                        <td class="w-full max-w-0 whitespace-nowrap truncate px-6 py-3 text-sm font-medium text-gray-900">
                            {{ contributor.name }}
                            <div v-if="contributor.id === commiterId" class="mr-1 mt-1 h-max">
                                <div class="h-6 w-fit rounded bg-white text-gray-500">
                                    <div class="ml-2 mr-2 pt-[.2rem] text-xs font-normal">#commiter</div>
                                </div>
                            </div>
                        </td>
                        <td class="hidden truncate whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 2xl:table-cell">
                            {{ contributor.address }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500">
                            <div class="bg-white rounded-full pl-4" v-html="toSvg(contributor.address.toLowerCase(), 25)"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRepositoryStore } from "~/stores/repos"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { toSvg } from "jdenticon"

defineProps({
    title: {
        type: String,
        required: true,
    },
    commiterId: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits<{
    (e: "close"): void
}>()

const route = useRoute()

const repositoryStore = useRepositoryStore()
const { repositories } = storeToRefs(repositoryStore)
const repositoryCon = computed(() => {
    const r = Object.values(repositories.value).find((repo) => repo.repositoryHash == route.params.projectHash)
    if (!r) {
        return null
    }
    return {
        contributors: r.contributors,
    }
})
</script>

<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex flex-col space-y-2">
            <div class="flex-1 mt-8 w-full px-8 pb-4 mx-auto hidden sm:block">
                <div class="inline-block min-w-full shadow-md border-b border-gray-200 align-middle">
                    <table class="min-w-full">
                        <thead>
                        <tr class="border-t border-gray-200">
                            <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">
                                <span class="lg:pl-2">Name</span>
                            </th>
                            <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Address</th>

                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                        <tr v-for="contributor in repositoryCon.contributors"  class="hover:bg-violet-100 cursor-pointer">
                            <td class="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                                {{ contributor.name }}
                            </td>
                            <td class="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">{{ contributor.address }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router"

const route = useRoute()

const repositoryStore = useRepositoryStore()
const { repositories } = storeToRefs(repositoryStore)
const repositoryCon = computed(() => {
    const r = Object.values(repositories.value).find(repo => repo.repositoryHash == route.params.projectHash)
    if (!r) {
        return null
    }
    return {
        contributors: r.contributors,
    }
})

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


<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <label for="address" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Number of reviews</label>
                        <div class="mt-1">
                            <input
                                v-model="numberOfReviews"
                                type="number"
                                name="reviews"
                                id="reviews"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Number of reviews"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="address" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Review reward</label>
                        <div class="mt-1">
                            <input
                                v-model="reviewReward"
                                type="number"
                                name="reward"
                                id="reward"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Reward for single review"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="emit('complete', numberOfReviews, reviewReward)"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Complete milestone
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SlideOver from "./SlideOver.vue"
import "@vuepic/vue-datepicker/dist/main.css"

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
    (e: "complete", numberOfReviews: number, reviewReward: number): void
}>()

const numberOfReviews = ref(0)
const reviewReward = ref(0)
</script>

<template>
    <div>
        <TransitionRoot :show="open" as="template">
            <Dialog as="div" @close="emit('close')" class="relative z-50">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> Milestone completion </DialogTitle>
                                <div class="mt-2">
                                    <div>
                                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Number of reviews</label>
                                        <div class="mt-1">
                                            <input
                                                v-model="numberOfReviews"
                                                type="number"
                                                name="reviews"
                                                id="reviews"
                                                placeholder="Number of reviews"
                                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 flex justify-between items-center">
                                    <button
                                        type="button"
                                        class="inline-flex items-center rounded-md bg-violet-300 py-2 px-3 text-sm font-semibold text-violet-700 font-medium shadow-sm hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                        @click="emit('close')"
                                    >
                                        Cancel
                                    </button>
                                    <div class="text-right">
                                        <button
                                            @click="emit('complete', numberOfReviews)"
                                            class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                                        >
                                            Complete milestone
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import "@vuepic/vue-datepicker/dist/main.css"
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"

defineProps({
    open: {
        type: Boolean,
        required: true,
    },
})
const emit = defineEmits<{
    (e: "close"): void
    (e: "complete", numberOfReviews: number): void
}>()
const numberOfReviews = ref(0)
</script>

<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @close="emit('close')">
            <TransitionChild
                as="template"
                enter="ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-16">
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full"
                        >
                            <DialogPanel class="pointer-events-auto w-screen max-w-4xl">
                                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    <div class="relative z-10 p-6" :class="{ 'border-b shadow': contentScroll > 0 }">
                                        <div class="flex items-start justify-between">
                                            <DialogTitle class="text-lg font-medium text-gray-900">
                                                <component :is="$slots.header" v-if="!!$slots.header" />
                                                <span v-else>{{ title }}</span>
                                            </DialogTitle>
                                            <div class="ml-3 flex h-7 items-center">
                                                <button
                                                    type="button"
                                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    @click="emit('close')"
                                                >
                                                    <span class="sr-only">
                                                        {{ $t("source.connector.closeSideOver") }}
                                                    </span>
                                                    <CloseIcon class="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div ref="contentWrapper" class="relative flex-1 overflow-y-scroll px-4 sm:px-6">
                                        <slot />
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { useSlots, ref } from "vue"
import { useScroll } from "@vueuse/core"
import { XCircleIcon as CloseIcon } from "@heroicons/vue/24/outline"

defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: null,
    },
})

const emit = defineEmits<{
    (e: "close"): void
}>()

const $slots = useSlots()
const contentWrapper = ref<HTMLElement | null>(null)
const { y: contentScroll } = useScroll(contentWrapper)
</script>

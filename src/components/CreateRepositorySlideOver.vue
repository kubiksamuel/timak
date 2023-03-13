<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="w-full">Hello</div>
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

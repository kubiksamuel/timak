<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <RadioGroup v-model="selectedSkillLevel">
                            <RadioGroupLabel class="ml-px block text-sm font-medium leading-6 text-gray-900">Evaluate your skills</RadioGroupLabel>

                            <div class="mt-1 grid grid-cols-2 gap-2">
                                <RadioGroupOption as="template" v-for="skillLevel in skillLevels" :key="skillLevel.title" :value="skillLevel" v-slot="{ checked, active }">
                                    <div
                                        :class="[
                                            checked ? 'border-transparent' : 'border-gray-300',
                                            active ? 'border-violet-600 ring-2 ring-violet-600' : '',
                                            'relative flex cursor-pointer rounded-lg border bg-white items-center p-4 shadow-sm focus:outline-none',
                                        ]"
                                    >
                                        <span class="flex flex-1">
                                            <span class="flex flex-col">
                                                <RadioGroupLabel as="span" class="block text-sm font-medium text-gray-900">{{ skillLevel.title }}</RadioGroupLabel>
                                                <RadioGroupDescription as="span" class="mt-1 flex items-center text-sm text-gray-500">{{ skillLevel.description }}</RadioGroupDescription>
                                            </span>
                                        </span>
                                        <CheckCircleIcon :class="[!checked ? 'invisible' : '', 'h-5 w-5 text-violet-600']" aria-hidden="true" />
                                        <span
                                            :class="[active ? 'border' : 'border-2', checked ? 'border-violet-600' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-lg']"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </RadioGroupOption>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <RadioGroup v-model="selectedRating">
                            <RadioGroupLabel class="ml-px block text-sm font-medium leading-6 text-gray-900">Rate a review</RadioGroupLabel>
                            <div class="mt-1 flex items-center space-x-3">
                                <RadioGroupOption as="template" v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :value="rating + 1" v-slot="{ active, checked }">
                                    <div class="flex items-center">
                                        <StarIcon :class="[selectedRating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0 hover:text-yellow-500']" aria-hidden="true" />
                                    </div>
                                </RadioGroupOption>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <div class="ml-px block text-sm font-medium leading-10 text-gray-900">Review Document</div>
                        <label
                            for="dropzone-file"
                            class="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed hover:border-violet-500 rounded-lg cursor-pointer bg-white"
                            :class="{ 'border-violet-400': file }"
                        >
                            <div v-if="file" class="flex space-x-2 text-gray-500 justify-center items-center">
                                <div>
                                    {{ file.name }}
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
                            <input @change="handleFileToUpload($event)" id="dropzone-file" type="file" class="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="addReview"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                    Add review
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SlideOver from "./SlideOver.vue"
import { Review, SkillLevel } from "~/types/review"
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/20/solid"
import { StarIcon } from "@heroicons/vue/20/solid"
import { addFileToIPFS } from "~/composables/ipfs"

const skillLevels = [
    { title: "Beginner", description: "Limited knowledge, new to the field." },
    { title: "Competent", description: "Good understanding, some experience in the area." },
    { title: "Proficient", description: "Advanced understanding, extensive experience in the area." },
    {
        title: "Expert",
        description: "Leading authority, exceptional knowledge and expertise in the area.",
    },
]

const selectedSkillLevel = ref(skillLevels[0])
const selectedRating = ref(0)

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    repository: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits<{
    (e: "close"): void
    (e: "create", newReview: Omit<Review, "reviewer">): void
}>()

const file = ref()

const handleFileToUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files) {
        file.value = target.files[0]
    }
}
const addReview = async () => {
    const contentIdentifier = await addFileToIPFS(file.value)
    const newReview: Omit<Review, "reviewer"> = {
        repositoryHash: props.repository.id,
        contentIdentifier,
        rating: selectedRating.value,
        reviewerSkillLevel: SkillLevel[selectedSkillLevel.value.title],
        milestoneId: props.repository.milestone.id,
    }
    emit("create", newReview)
}
</script>

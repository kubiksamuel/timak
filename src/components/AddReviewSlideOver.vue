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
                    <Listbox as="div" v-model="selectedMilestone">
                        <div class="font-medium text-sm text-gray-900">Versions</div>

                        <div class="relative my-2 w-full">
                            <ListboxButton
                                class="relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:text-sm sm:leading-6"
                            >
                                <span class="flex items-cente justify-between">
                                    <span class="ml-3 block truncate">{{ selectedMilestone.title }}</span>
                                    <span class="ml-3 block truncate text-gray-500">{{ selectedMilestone.version.commitName }}</span>
                                </span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </ListboxButton>

                            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <ListboxOptions
                                    class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                >
                                    <ListboxOption as="template" v-for="milestone in repository.milestones" :key="milestone.id" :value="milestone" v-slot="{ active, selected }">
                                        <li :class="[active ? 'bg-violet-500 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9 list-none']">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center">
                                                    <img src="/src/img/arrow_right.png" alt="" class="h-5 w-5 flex-shrink-0 rounded-full" />
                                                    <span class="ml-3 block truncate"> {{ milestone.title }} </span>
                                                </div>
                                                <span class="mr-3 block truncate" :class="[active ? ' text-white' : 'text-gray-500']"> {{ milestone.version.commitName }}</span>
                                            </div>

                                            <span v-if="selected" :class="[active ? 'text-white' : 'text-violet-500', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </div>
                    </Listbox>

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
                        <div v-if="v$.file.$error" class="text-sm text-red-500 py-1 ml-2">
                            {{ v$.file.$errors[0]?.$message.toString() }}
                        </div>
                    </div>
                </div>
                <div v-if="currentLoaderStep >= 0" class="items-center py-5 flex justify-center">
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
                            <span class="text-gray-400"> Uploading review to ipfs</span>
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
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid"
import { useVuelidate } from "@vuelidate/core"
import { required, helpers, minValue } from "@vuelidate/validators"

const skillLevels = [
    { title: "Beginner", description: "Limited knowledge, new to the field." },
    { title: "Competent", description: "Good understanding, some experience in the area." },
    { title: "Proficient", description: "Advanced understanding, extensive experience in the area." },
    {
        title: "Expert",
        description: "Leading authority, exceptional knowledge and expertise in the area.",
    },
]

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

console.log("Props rep: ", props.repository)

const selectedSkillLevel = ref(skillLevels[0])
const selectedRating = ref(1)
const selectedMilestone = ref(props.repository.milestones[props.repository.milestones.length - 1])

const emit = defineEmits<{
    (e: "close"): void
    (e: "create", newReview: Omit<Review, "reviewer">): void
}>()

const file = ref()
const currentLoaderStep = ref(-1)

const handleFileToUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files) {
        file.value = target.files[0]
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const rules = {
    file: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
}

const v$ = useVuelidate(rules, {
    file: file.value,
})

const addReview = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
        return
    }
    currentLoaderStep.value = 0
    await sleep(1200)
    currentLoaderStep.value = 1
    const contentIdentifier = await addFileToIPFS(file.value)
    await sleep(1200)
    currentLoaderStep.value = 2
    await sleep(1200)
    currentLoaderStep.value = 3
    await sleep(1200)
    const newReview: Omit<Review, "reviewer"> = {
        repositoryHash: props.repository.repositoryHash,
        contentIdentifier,
        rating: selectedRating.value,
        reviewerSkillLevel: SkillLevel[selectedSkillLevel.value.title],
        milestoneId: selectedMilestone.value.id,
    }

    emit("create", newReview)
}
</script>

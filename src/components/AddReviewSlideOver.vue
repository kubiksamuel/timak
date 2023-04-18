<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <RadioGroup v-model="selectedSkillLevel">
                            <RadioGroupLabel class="ml-px block text-sm font-medium leading-6 text-gray-900">Select a mailing list</RadioGroupLabel>

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
                            <RadioGroupLabel class="ml-px block text-sm font-medium leading-6 text-gray-900">Choose a label color</RadioGroupLabel>
                            <div class="mt-1 flex items-center space-x-3">
                                <RadioGroupOption as="template" v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :value="rating + 1" v-slot="{ active, checked }">
                                    <div class="flex items-center">
                                        <StarIcon :class="[selectedRating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0 hover:text-yellow-500']" aria-hidden="true" />
                                    </div>
                                </RadioGroupOption>
                            </div>
                        </RadioGroup>
                        <!--                <label for="description" class="ml-px block pl-4 text-sm font-medium leading-6 text-gray-900">Rating</label>-->
                        <!--                <div class="mt-1">-->
                        <!--                    <input-->
                        <!--                        v-model="newReview.rating"-->
                        <!--                        type="text"-->
                        <!--                        name="description"-->
                        <!--                        class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"-->
                        <!--                        placeholder="Description"-->
                        <!--                    />-->
                        <!--                </div>-->
                    </div>
                    <div>
                        <label for="description" class="ml-px block text-sm font-medium leading-6 text-gray-900">CID(temporary)</label>
                        <div class="mt-1">
                            <input
                                v-model="ipfsHash"
                                type="text"
                                name="description"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Description"
                            />
                        </div>
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
import { ref, Ref, watch } from "vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { Review } from "~/types/repository"
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/20/solid"
import { StarIcon } from "@heroicons/vue/20/solid"

const repository = useRepositoryStore()
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
    repositoryHash: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: "close"): void
}>()

enum SkillLevel {
    Beginner,
    Competent,
    Proficient,
    Expert,
}

const ipfsHash = ref()
const selectRating = (rating: number) => console.log("Rating: ", rating)
const addReview = () => {
    console.log("Repo hash: ", props.repositoryHash)
    console.log("Rating: ", selectedRating.value)
    console.log("Skill level: ", SkillLevel[selectedSkillLevel.value.title])
    console.log("CID: ", ipfsHash)
    // repository.createReview()
}

watch(selectedRating, () => {
    console.log("Rating: ", selectedRating.value)
})
</script>

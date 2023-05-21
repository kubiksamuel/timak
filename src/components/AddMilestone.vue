<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Title</label>
                        <div class="mt-1">
                            <input
                                v-model="newMilestone.title"
                                type="text"
                                name="title"
                                id="title"
                                :class="[v$.title.$error ? 'ring-red-400' : 'ring-gray-300']"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset outline-none focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Title"
                            />
                            <div v-if="v$.title.$error" class="text-sm text-red-500 py-1 ml-2">
                                {{ v$.title.$errors[0]?.$message.toString() }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Description</label>
                        <div class="mt-1">
                            <input
                                v-model="newMilestone.description"
                                type="text"
                                name="description"
                                id="description"
                                :class="[v$.title.$error ? 'ring-red-400' : 'ring-gray-300']"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 outline-none ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset outline-none focus:ring-violet-600 sm:text-sm sm:leading-6"
                                placeholder="Description"
                            />
                            <div v-if="v$.description.$error" class="text-sm text-red-500 py-1 ml-2">
                                {{ v$.description.$errors[0]?.$message.toString() }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="ml-px block text-sm font-medium leading-6 text-gray-900">Finish deadline</div>
                        <div class="mt-1 pl-2">
                            <VueDatePicker v-model="newMilestone.deadline" :min-date="new Date()" :enable-time-picker="false" />
                        </div>
                        <div v-if="v$.deadline.$error" class="text-sm text-red-500 py-1 ml-2">
                            {{ v$.deadline.$errors[0]?.$message.toString() }}
                        </div>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="addMilestone"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 outline-none focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                >
                    Add milestone
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { reactive, Ref } from "vue"
import SlideOver from "./SlideOver.vue"
import { MilestoneMeta } from "~/types/milestone"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from "@vuelidate/validators"

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
    (e: "create", newMilestone: MilestoneMeta): void
}>()

const newMilestone: Omit<MilestoneMeta, "id" | "completed"> = reactive({
    title: "",
    description: "",
    requestReview: false,
    deadline: 0,
})

const rules = {
    title: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
    description: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
    deadline: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
}

const v$ = useVuelidate(rules, newMilestone)

const addMilestone = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
        return
    }
    emit("create", newMilestone)
}
</script>

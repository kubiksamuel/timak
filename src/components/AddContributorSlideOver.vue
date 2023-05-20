<template>
    <SlideOver v-bind="{ open }" @close="emit('close')" :title="title">
        <div class="flex h-full flex-col pt-1">
            <div class="h-full flex-1">
                <div class="flex flex-col space-y-3">
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Address</label>
                        <div class="mt-1">
                            <input
                                v-model="newContributor.address"
                                type="text"
                                name="address"
                                id="address"
                                :class="[v$.address.$error ? 'ring-red-400' : 'ring-gray-300']"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Address"
                            />
                            <div v-if="v$.address.$error" class="text-sm text-red-500 py-1 ml-2">
                                {{ v$.address.$errors[0]?.$message.toString() }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="address" class="ml-px block text-sm font-medium leading-6 text-gray-900">Name of contributor</label>
                        <div class="mt-1">
                            <input
                                v-model="newContributor.name"
                                type="text"
                                name="address"
                                id="address"
                                :class="[v$.name.$error ? 'ring-red-400' : 'ring-gray-300']"
                                class="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Name"
                            />
                            <div v-if="v$.name.$error" class="text-sm text-red-500 py-1 ml-2">
                                {{ v$.name.$errors[0]?.$message.toString() }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="-mx-6" />

            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click="addNewContributor"
                    class="inline-flex justify-center rounded-md bg-violet-700 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Add contributor
                </button>
            </div>
        </div>
    </SlideOver>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import SlideOver from "./SlideOver.vue"
import { useRepositoryStore } from "~/stores/repos"
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from "@vuelidate/validators"
import { useRoute } from "vue-router"

const { addContributor } = useRepositoryStore()
const route = useRoute()

const repositoryHash = route.params.projectHash

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

const newContributor = reactive({
    address: "",
    name: "",
})

const rules = {
    address: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
    name: {
        required: helpers.withMessage("Hold on! This field can't be left empty. Please fill it out so we can proceed.", required),
    },
}

const v$ = useVuelidate(rules, newContributor)

const addNewContributor = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
        return
    }

    await addContributor(repositoryHash, newContributor.address, newContributor.name)
}
</script>

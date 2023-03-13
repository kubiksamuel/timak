<template>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl m-4">Erik's Crypto Guest Book</h1>
        <button v-if="!account" class="bg-green-300 rounded p-4" @click="connectWallet">Connect Wallet</button>
        <div v-if="account" class="mt-5">
            <input v-model="messageInput" name="guestBookInfo" class="py-4 px-4 shadow border rounded" maxlength="20" />
            <button class="bg-yellow-300 rounded p-4 mt-10" @click="createRepository(messageInput)">Send</button>
        </div>

        <div v-if="account" class="border shadow w-4/12 p-4 mt-10">
            <div v-for="(postedRepository, idx) in postedRepositories" :key="idx" class="flex flex-col m-auto" :class="{ 'mt-4': idx > 1 }">
                <div v-if="postedRepository.message" class="flex justify-between w-full">
                    <span class="font-semibold">{{ postedRepository.timestamp }}</span>
                    <span>{{ postedRepository.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<route lang="yaml">
meta:
    layout: home
</route>
<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useRepositoryStore } from "~/stores/repos"
const something = "s"
console.log("something: ", something)
if (something == "s") {
    console.log(something)
}
const messageInput = ref(null as any)
const repositoryStore = useRepositoryStore()
const { createRepository, connectWallet } = useRepositoryStore()
const { postedRepositories, account } = storeToRefs(repositoryStore)
console.log(postedRepositories)
</script>

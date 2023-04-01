<template>
    <div>
        <div v-if="!account" class="h-full flex w-full">
            <div class="h-full w-full px-6 flex flex-col items-center lg:col-span-7 xl:col-span-6 justify-center items-center">
                <div class="mx-auto max-w-2xl lg:mx-0 pt-20">
                    <div class="hidden sm:mt-32 sm:flex lg:mt-16"></div>
                    <h1 class="mt-24 text-4xl text-center font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                        <p class="text-violet-600">VersionVault:</p>
                        The Ultimate Backup System for Science Projects
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-gray-600"></p>
                    <div class="mt-10 flex items-center gap-x-6">
                        <button v-if="!account" class="mx-auto bg-violet-700 text-white rounded p-4" @click="connectWallet">Connect Wallet</button>
                    </div>
                </div>
            </div>
            <div class="h-screen">
                <img
                    class="h-full w-[1200px]"
                    src="https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80"
                    alt=""
                />
            </div>
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
        </div>
        <div v-else class="border shadow w-4/12 p-4 mt-10">
            <h3 class="text-2xl">Number Of Entries</h3>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
    layout: home
path: /home
</route>
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useRepositoryStore } from "~/stores/repos"
const something = "s"
console.log("something: ", something)
if (something == "s") {
    console.log(something)
}

const repositoryStore = useRepositoryStore()
const { connectWallet } = useRepositoryStore()
const { account } = storeToRefs(repositoryStore)
</script>

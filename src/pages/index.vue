<template>
    <div class="h-full">
        <div class="h-full flex w-full">
            <div class="h-full w-full px-6 pb-10 flex flex-col items-center lg:col-span-7 xl:col-span-6 justify-center items-center">
                <div class="mx-auto max-w-2xl lg:mx-0">
                    <h1 class="text-4xl text-center font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                        <p class="text-violet-600">VersionVault:</p>
                        The Ultimate Backup System for Science Projects
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-gray-600"></p>
                    <div class="mt-12 flex items-center gap-x-6">
                        <button class="mx-auto bg-violet-700 text-white rounded p-4" @click="connectWallet">Connect Wallet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!--<route lang="yaml">-->
<!--meta:-->
<!--    layout: home-->
<!--path: /home-->
<!--</route>-->
<script setup lang="ts">
import { watch, watchEffect } from "vue"
import { storeToRefs } from "pinia"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"

const something = "s"
console.log("something: ", something)
if (something == "s") {
    console.log(something)
}

const repositoryStore = useRepositoryStore()
const { connectWallet } = useRepositoryStore()
console.log("Account in index: ", repositoryStore.account)
const router = useRouter()
console.log("Router: ", router)
watchEffect(async () => {
    if (repositoryStore.account) {
        setTimeout(async () => await router.push({ path: "/dashboard" }, 1000))
    }
})
</script>

<template>
    <div class="min-h-screen w-full">
        <div class="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div class="flex grow flex-col gap-y-1 overflow-y-auto bg-violet-600 px-6">
                <div class="flex h-16 text-violet-100 text-lg font-bold shrink-0 items-center justify-center">
                    <div>VersionVault</div>
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li v-for="item in navigation" :key="item.name">
                                    <button
                                        @click="redirect(item.href)"
                                        class="text-violet-200 hover:text-white hover:bg-violet-700 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
                                    >
                                        <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {{ item.name }}
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li class="mx-auto mt-auto w-full">
                            <div class="flex items-center w-full py-3 gap-x-2 text-sm font-semibold justify-between leading-6 text-white">
                                <div class="bg-white rounded-full p-1" v-html="svgString"></div>

                                <span class="truncate">{{ account }}</span>
                                <div class="">
                                    <button @click="logout" class="px-6 py-1 font-medium hover:bg-violet-700 rounded-md">Logout</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <main class="lg:pl-72">
            <div class="px-4 sm:px-6 :px-8">
                <slot></slot>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ChartPieIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon } from "@heroicons/vue/24/outline"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"
import { toSvg } from "jdenticon"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const router = useRouter()
const repositoryStore = useRepositoryStore()

const { account } = storeToRefs(repositoryStore)
console.log("SVG account: ", account.value)
const svgString = toSvg(account.value, 25)
const navigation = ref([
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Contributor projects", href: "/contributor_projects", icon: FolderIcon, current: false },
    { name: "To review", href: "/toReview", icon: DocumentDuplicateIcon },
    { name: "My reviews", href: "#", icon: ChartPieIcon },
])

const redirect = (_path: string) => {
    router.push({
        path: _path,
    })
}

const logout = () => {
    repositoryStore.logoutAccount()
    router.push({ path: "/" })
}
</script>

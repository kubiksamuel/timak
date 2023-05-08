<template>
    <!--
      This example requires updating your template:

      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    -->
    <div class="min-h-screen w-full">
        <!-- Static sidebar for desktop -->
        <div class="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
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
                        <li>
                            <div class="text-xs font-semibold leading-6 text-violet-200">Your teams</div>
                            <ul role="list" class="-mx-2 mt-2 space-y-1">
                                <li v-for="team in teams" :key="team.name">
                                    <a
                                        :href="team.href"
                                        :class="[
                                            team.current ? 'bg-violet-700 text-white' : 'text-violet-200 hover:text-white hover:bg-violet-700',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                        ]"
                                    >
                                        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-violet-400 bg-violet-500 text-[0.625rem] font-medium text-white">{{
                                            team.initial
                                        }}</span>
                                        <span class="truncate">{{ team.name }}</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="mx-auto mt-auto w-full">
                            <div class="flex items-center w-full py-3 gap-x-2 text-sm font-semibold justify-between leading-6 text-white">
                                <div class="bg-white rounded-full p-1" v-html="svgString"></div>

                                <!--                                    <img-->
                                <!--                                        class="h-8 w-8 rounded-full bg-violet-700"-->
                                <!--                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"-->
                                <!--                                        alt=""-->
                                <!--                                    />-->
                                <!--                                    <Identicon :size="128" :theme="'polkadot'" :value="'5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'"></Identicon>-->
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
import { CalendarIcon, ChartPieIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon } from "@heroicons/vue/24/outline"
import { useRepositoryStore } from "~/stores/repos"
import { useRouter } from "vue-router"
import { toSvg } from "jdenticon"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const router = useRouter()
const repositoryStore = useRepositoryStore()

const { account } = storeToRefs(repositoryStore)
const svgString = toSvg(account, 25)
const navigation = ref([
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Team", href: "#", icon: UsersIcon },
    { name: "Contributor projects", href: "/contributor_projects", icon: FolderIcon, current: false },
    { name: "To review", href: "/toReview", icon: DocumentDuplicateIcon },
    { name: "My reviews", href: "#", icon: ChartPieIcon },
])
const teams = [
    { id: 1, name: "Heroicons", href: "#", initial: "H" },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
    { id: 3, name: "Workcation", href: "#", initial: "W" },
]

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

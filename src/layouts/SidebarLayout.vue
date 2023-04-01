<template>
    <div class="flex min-h-screen w-screen">
        <!-- Static sidebar for desktop -->
        <div class="flex w-64 flex-col border-r border-gray-200 bg-violet-200 pt-5 pb-4">
            <div class="text-lg flex justify-center flex-shrink-0 items-center px-6 text-violet-800">
                VersionVault
                <!--                <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500" alt="Your Company" />-->
            </div>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
                <!-- User account dropdown -->
                <Menu as="div" class="relative inline-block px-3 text-left">
                    <div>
                        <MenuButton
                            class="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                        >
                            <span class="flex w-full items-center justify-between">
                                <span class="flex min-w-0 items-center justify-between space-x-3">
                                    <img
                                        class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                                        src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                                        alt=""
                                    />
                                    <span class="flex min-w-0 flex-1 flex-col">
                                        <span class="truncate text-sm font-medium text-gray-900">Jessy Schwarz</span>
                                        <span class="truncate text-sm text-gray-500">@jessyschwarz</span>
                                    </span>
                                </span>
                            </span>
                        </MenuButton>
                    </div>
                    <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                    >
                        <MenuItems class="absolute right-0 left-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                    <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">View profile</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Settings</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Notifications</a>
                                </MenuItem>
                            </div>
                            <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                    <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Get desktop app</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Support</a>
                                </MenuItem>
                            </div>
                            <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                    <button :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Logout</button>

                                    <!--                                    <button @click="logout" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Logout</button>-->
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
                <!-- Sidebar Search -->
                <div class="mt-5 px-3">
                    <label for="search" class="sr-only">Search</label>
                    <div class="relative mt-1 rounded-md shadow-sm">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                            <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            class="block w-full rounded-md border-0 py-1.5 pl-9 ring-1 ring-violet-300 placeholder:text-gray-400 focus:ring-1 outline-none focus:ring-violet-600 sm:text-sm sm:leading-6"
                            placeholder="Search123a"
                        />
                    </div>
                </div>
                <!-- Navigation -->
                <nav class="mt-6 px-3">
                    <div class="space-y-1">
                        <a
                            v-for="item in navigation"
                            :key="item.name"
                            :href="item.href"
                            :class="[
                                item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                            ]"
                            :aria-current="item.current ? 'page' : undefined"
                        >
                            <component :is="item.icon" :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 h-6 w-6 flex-shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                        </a>
                    </div>
                    <div class="mt-8">
                        <!-- Secondary navigation -->
                        <h3 class="px-3 text-sm font-medium text-gray-500" id="desktop-teams-headline">Teams</h3>
                        <div class="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
                            <a
                                v-for="team in teams"
                                :key="team.name"
                                :href="team.href"
                                class="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <span :class="[team.bgColorClass, 'mr-4 h-2.5 w-2.5 rounded-full']" aria-hidden="true" />
                                <span class="truncate">{{ team.name }}</span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <!-- Main column -->
        <div class="w-full">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { Bars3CenterLeftIcon, Bars4Icon, ClockIcon, HomeIcon, XMarkIcon } from "@heroicons/vue/24/outline"

const navigation = [
    { name: "Home", href: "#", icon: HomeIcon, current: true },
    { name: "My tasks", href: "#", icon: Bars4Icon, current: false },
    { name: "Recent", href: "#", icon: ClockIcon, current: false },
]
const teams = [
    { name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
    { name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
    { name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
]
</script>

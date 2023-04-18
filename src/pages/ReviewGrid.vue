<template>
    <div class="pt-10">
        <div class="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:lg:grid-cols-5 3xl:lg:grid-cols-6">
            <div v-for="review in reviews" :key="review.id" class="cursor-pointer rounded-lg bg-white shadow hover:shadow-lg">
                <button class="flex space-x-2 p-6 text-left">
                    <div class="w-11/12">
                        <div>
                            <h3 class="text-lg font-medium leading-6 text-gray-900">
                                <span class="" />
                                {{ review.reviewer }}
                            </h3>
                            <p class="py-2 text-sm text-gray-600">{{ review.reviewerSkillLevel }}</p>
                        </div>
                        <!--                    <div class="flex flex-wrap overflow-hidden text-ellipsis whitespace-normal">-->
                        <!--                        <div v-for="tag in preset.meta.tags" :key="tag" class="mr-1 mt-1 h-max">-->
                        <!--                            <div class="h-6 w-fit rounded bg-indigo-50">-->
                        <!--                                <div class="ml-2 mr-2 pt-[.2rem] text-xs font-normal text-indigo-600">-->
                        <!--                                    {{ tag }}-->
                        <!--                                </div>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                        <!--                    </div>-->
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const reviews = [
    {
        id: 0,
        repositoryScore: 90,
        reviewer: "John",
        reviewerScore: 3,
        reviewerSkillLevel: "Beginner",
    },
    {
        id: 1,
        repositoryScore: 90,
        reviewer: "John",
        reviewerScore: 3,
        reviewerSkillLevel: "Beginner",
    },
]
</script>

<style scoped></style>

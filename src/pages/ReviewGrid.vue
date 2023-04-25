<template>
    <div class="pt-10">
        <div class="xlg:grid-cols-3 grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 md:grid-cols-3 2xl:lg:grid-cols-5 3xl:lg:grid-cols-6">
            <div v-for="review in reviews" :key="review.id" class="group relative rounded-lg bg-white shadow hover:shadow-lg">
                <div class="flex flex-col p-6 pb-16 space-y-1">
                    <div class="flex items-center truncate justify-between space-x-3">
                        <p class="text-lg w-full font-medium bg-white truncate hover:break-words hover:whitespace-normal hover:overflow-visible">{{ review.reviewer }}</p>
                        <div class="bg-gray-100 p-1 rounded-full" v-html="toSvg(review.reviewer, 25)"></div>
                    </div>

                    <div class="flex flex-wrap overflow-hidden text-ellipsis whitespace-normal">
                        <div class="mr-1 mt-1 h-max">
                            <div class="h-6 w-fit rounded bg-violet-50">
                                <div class="pl-2 mr-2 pt-[.2rem] text-xs font-normal">#{{ review.reviewerSkillLevel }}</div>
                            </div>
                        </div>
                        <div class="mr-1 mt-1 h-max">
                            <div class="h-6 w-fit rounded bg-violet-50">
                                <div class="ml-2 mr-2 pt-[.2rem] text-xs font-normal">#{{ review.reviewerScore }} reviews</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-start items-center pt-1">
                        <div>
                            <div class="flex items-center">
                                <StarIcon
                                    v-for="rating in [0, 1, 2, 3, 4]"
                                    :key="rating"
                                    :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-0 flex h-11 w-full items-center border-t px-6">
                    <button
                        @click="downloadReview(review.ipfsHash)"
                        type="button"
                        class="focus:ring-none w-full group inline-flex flex-shrink-0 h-full items-center text-sm font-medium text-violet-500 hover:text-violet-800 focus:outline-none"
                    >
                        Download review
                        <DownloadIcon class="ml-1 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon as DownloadIcon } from "@heroicons/vue/24/outline"
import { StarIcon } from "@heroicons/vue/20/solid"
import { Review, SkillLevel } from "~/types/review"
import { toSvg } from "jdenticon"
import { useRepositoryStore } from "~/stores/repos"
import { ref, onMounted, watch } from "vue"

const props = defineProps({
    repositoryHash: {
        type: String,
        required: true,
    },
})
const repositoryStore = useRepositoryStore()

const reviews = ref()

onMounted(async () => {
    const repositoryReviews = await repositoryStore.getReviewsByRepository(props.repositoryHash)
    reviews.value = await Promise.all(
        repositoryReviews.map(async (review: Review) => {
            return {
                id: review.repositoryHash,
                reviewer: review.reviewer,
                reviewerScore: await repositoryStore.getReviewerScore(review.reviewer),
                reviewerSkillLevel: SkillLevel[review.reviewerSkillLevel],
                rating: review.rating,
                ipfsHash: review.contentIdentifier,
            }
        })
    )
})
</script>

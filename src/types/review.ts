export type Review = {
    id: number
    repositoryHash?: string
    reviewer: string
    reviewerSkillLevel: number
    rating: number
    contentIdentifier: string
    reviewerScore?: number
    milestoneId: number
    reward: number
    // versionId: string
}

export enum SkillLevel {
    Beginner,
    Competent,
    Proficient,
    Expert,
}

export type Review = {
    repositoryHash?: string
    reviewer: string
    reviewerSkillLevel: number
    rating: number
    contentIdentifier: string
    reviewerScore?: number
    // versionId: string
}

export enum SkillLevel {
    Beginner,
    Competent,
    Proficient,
    Expert,
}
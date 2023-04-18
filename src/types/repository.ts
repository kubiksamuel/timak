export type RepositoryMeta = {
    name: string
    description: string
}

export type Review = {
    repositoryHash: string
    reviewerAddress: string
    reviewerSkillLevel: number
    rating: number
    ipfsHash: string
    // versionId: string
}

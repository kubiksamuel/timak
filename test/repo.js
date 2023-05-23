const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Repository Factory", function () {
    const provider = waffle.provider;

    let repositoryfactory;
    let repositoryContract;
    let admin, testUser, randomUser;

    let repositoryName = "repoName";
    let repositoryDescription = "repoDescription";

    let repositoryName_2 = "repoName_2";
    let repositoryDescription_2 = "repoDescription_2";

    let numberOfReviews_milestone_1 = 2;
    let numberOfReviews_milestone_2 = 1;

    let versionName = "version_name";
    let ipfsHash = "ipfs_hash"

    let milestoneId_1 = 0;
    let milestone_title = "m_title";
    let milestone_deadline = 2025;
    let milestone_description = "m_description";

    let milestoneId_2 = 1;
    let milestone_title_2 = "m_title_2";
    let milestone_deadline_2 = 2028;
    let milestone_description_2 = "m_description_2";

    let ms_contentIdentifier_1 = "content_identifier_1";
    let ms_rating_1 = 5;
    let ms_reviewerSkillLevel_1 = 4;

    let ms_contentIdentifier_2 = "content_identifier_2";
    let ms_rating_2 = 4;
    let ms_reviewerSkillLevel_2 = 3;

    let ms_contentIdentifier_3 = "content_identifier_3";
    let ms_rating_3 = 3;
    let ms_reviewerSkillLevel_3 = 2;

    before(async () => {
        [admin, testUser, randomUser] = await ethers.getSigners();
        const RepositoryFactory = await ethers.getContractFactory("RepositoryFactory");
        repositoryfactory = await RepositoryFactory.deploy();
        await repositoryfactory.deployed();
    });

    it("Get smart contract address on blockchain", async function () {
        const contractAddress = await repositoryfactory.address;
        expect(contractAddress).not.to.equal(ethers.constants.AddressZero);
        expect(contractAddress).not.to.equal('');
        expect(contractAddress).not.to.equal(null);
        expect(contractAddress).not.to.equal(undefined);
    });

    it("Create repository", async function () {
        const repo = await repositoryfactory.connect(admin).createRepositoryContract(repositoryName,repositoryDescription);
        const event = await repo.wait();
        const addNewRepositorySet = event.events[4];

        expect(admin.address).to.equal(addNewRepositorySet.args.owner);

        expect(addNewRepositorySet.args.name).to.equal(repositoryName);
        expect((await repositoryfactory.getAllRepositories()).length).to.equal(1);
        expect((await repositoryfactory.getUsers()).length).to.equal(1);
        account = event.events[4].args.owner;

        const userRepos = await repositoryfactory.getUserRepos(account)
        expect(userRepos.length).to.equal(1);
        expect(addNewRepositorySet.args.repository).to.equal(userRepos[0]);
    });

    it("Create second repository by same user", async function () {
        const repo = await repositoryfactory.connect(admin).createRepositoryContract(repositoryName_2,repositoryDescription_2);
        const event = await repo.wait();
        const addNewRepositorySet = event.events[4];

        expect(admin.address).to.equal(addNewRepositorySet.args.owner);

        expect(addNewRepositorySet.args.name).to.equal(repositoryName_2);
        const allRepos = await repositoryfactory.getAllRepositories()
        expect(allRepos.length).to.equal(2);
        expect((await repositoryfactory.getUsers()).length).to.equal(1);
        account = event.events[4].args.owner;

        const userRepos = await repositoryfactory.getUserRepos(account)
        expect(userRepos.length).to.equal(2);
        expect(userRepos[0]).to.equal(allRepos[0]);
        expect(userRepos[1]).to.equal(allRepos[1]);
        expect(addNewRepositorySet.args.repository).to.equal(userRepos[1]);
    });

    it("Add second user", async function () {
        const repo = await repositoryfactory.addUser(testUser.address);
        await repo.wait();

        const allUsers = await repositoryfactory.getUsers();
        expect(allUsers.length).to.equal(2);
        expect(allUsers[0]).to.equal(admin.address);
        expect(allUsers[1]).to.equal(testUser.address);
        expect((await repositoryfactory.getUserRepos(testUser.address)).length).to.equal(0);
        expect((await repositoryfactory.getUserRepos(admin.address)).length).to.equal(2);
    });

    it("Check if user exists", async function () {
        expect((await repositoryfactory.isAlreadyUser(testUser.address))).to.equal(true);
        expect((await repositoryfactory.isAlreadyUser(admin.address))).to.equal(true);
        expect((await repositoryfactory.isAlreadyUser(randomUser.address))).to.equal(false);
    });

    it("Add repository to other user", async function () {
        const allRepos = await repositoryfactory.getAllRepositories()

        const addRepo = await repositoryfactory.addRepositoryToUser(testUser.address, allRepos[1], "UserName");
        await addRepo.wait();

        const userRepos = await repositoryfactory.getUserRepos(testUser.address);
        expect(userRepos.length).to.equal(1);
        expect(userRepos[0]).to.equal(allRepos[1]);
    });

    it("Set 2 reviews to first milestone of repository", async function () {
        const allRepos = await repositoryfactory.getAllRepositories();
        let userRepo = await repositoryfactory.getRepositoryByHash(allRepos[0]);

        expect((await repositoryfactory.getReviewableRepositories()).length).to.equal(0);
        expect(allRepos.length).to.equal(2);

        repositoryContract = await ethers.getContractAt("Repository", userRepo);

        const setVersionTx = await repositoryContract.connect(admin).addVersionOfRepository(versionName, ipfsHash);
        await setVersionTx.wait();

        const addMilestoneTx = await repositoryContract.addMilestone(milestone_deadline, milestone_title, milestone_description);
        const result = await addMilestoneTx.wait();

        const completeMileTx = await repositoryContract.connect(admin).completeMilestone(result.events[0].args.id, numberOfReviews_milestone_1);
        await completeMileTx.wait();

        const reviewableRepos = await repositoryfactory.getReviewableRepositories();

        expect(reviewableRepos.length).to.equal(1);
        expect(allRepos.length).to.equal(2);
        expect(await repositoryContract.isRepositoryReviewable()).to.equal(true);
    });

    it("Create first review", async function () {
        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(0);

        const review = await repositoryfactory.connect(testUser).createReview(repositoryContract.address, ms_contentIdentifier_1, ms_rating_1, ms_reviewerSkillLevel_1, milestoneId_1);
        const event = await review.wait();
        const reviewAddedEvent = event.events[0];

        expect((await reviewAddedEvent.args.reviewer)).to.equal(testUser.address);
        expect((await reviewAddedEvent.args.repository)).to.equal(repositoryContract.address);
        expect((await reviewAddedEvent.args.contentIdentifier)).to.equal(ms_contentIdentifier_1);
        expect((await reviewAddedEvent.args.rating)).to.equal(ms_rating_1);
        expect((await reviewAddedEvent.args.reviewerSkillLevel)).to.equal(ms_reviewerSkillLevel_1);
        expect((await reviewAddedEvent.args.milestoneId)).to.equal(milestoneId_1);
        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(1);
    });

    it("Create second review to same repository by different user", async function () {
        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(1);

        const review = await repositoryfactory.connect(randomUser).createReview(repositoryContract.address, ms_contentIdentifier_2, ms_rating_2, ms_reviewerSkillLevel_2, milestoneId_1);
        const event = await review.wait();
        const reviewAddedEvent = event.events[0];

        expect((await reviewAddedEvent.args.reviewer)).to.equal(randomUser.address);
        expect((await reviewAddedEvent.args.repository)).to.equal(repositoryContract.address);
        expect((await reviewAddedEvent.args.contentIdentifier)).to.equal(ms_contentIdentifier_2);
        expect((await reviewAddedEvent.args.rating)).to.equal(ms_rating_2);
        expect((await reviewAddedEvent.args.reviewerSkillLevel)).to.equal(ms_reviewerSkillLevel_2);
        expect((await reviewAddedEvent.args.milestoneId)).to.equal(milestoneId_1);
        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(2);
    });

    it("Fail add third review", async function () {
        expect(await repositoryContract.isRepositoryReviewable()).to.equal(false);
        await expect(repositoryfactory.connect(randomUser).createReview(repositoryContract.address, ms_contentIdentifier_3, ms_rating_3, ms_reviewerSkillLevel_3, milestoneId_1)).to.be.reverted;
    });

    it("Set 1 review to second milestone of repository", async function () {
        expect(await repositoryContract.isRepositoryReviewable()).to.equal(false);
        const addMilestoneTx = await repositoryContract.addMilestone(milestone_deadline_2, milestone_title_2, milestone_description_2);
        const result = await addMilestoneTx.wait();

        const completeMileTx = await repositoryContract.connect(admin).completeMilestone(result.events[0].args.id, numberOfReviews_milestone_2);
        await completeMileTx.wait();

        expect((await repositoryfactory.getReviewableRepositories()).length).to.equal(1);
        expect(await repositoryContract.isRepositoryReviewable()).to.equal(true);
    });

    it("Create review to second milestone", async function () {
        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(2);

        const review = await repositoryfactory.connect(testUser).createReview(repositoryContract.address, ms_contentIdentifier_3, ms_rating_3, ms_reviewerSkillLevel_3, milestoneId_2);
        await review.wait();

        expect((await repositoryfactory.getRepositoryReviews(repositoryContract.address)).length).to.equal(3);
    });

    it("Check all reviews of repository", async function () {
        const allRepoReviews = await repositoryfactory.getRepositoryReviews(repositoryContract.address);

        expect(allRepoReviews.length).to.equal(3);

        expect(allRepoReviews[0].repository).to.equal(repositoryContract.address);
        expect(allRepoReviews[0].reviewer).to.equal(testUser.address);
        expect(allRepoReviews[0].reviewerSkillLevel).to.equal(ms_reviewerSkillLevel_1);
        expect(allRepoReviews[0].contentIdentifier).to.equal(ms_contentIdentifier_1);
        expect(allRepoReviews[0].rating).to.equal(ms_rating_1);
        expect(allRepoReviews[0].milestoneId).to.equal(milestoneId_1);

        expect(allRepoReviews[1].repository).to.equal(repositoryContract.address);
        expect(allRepoReviews[1].reviewer).to.equal(randomUser.address);
        expect(allRepoReviews[1].reviewerSkillLevel).to.equal(ms_reviewerSkillLevel_2);
        expect(allRepoReviews[1].contentIdentifier).to.equal(ms_contentIdentifier_2);
        expect(allRepoReviews[1].rating).to.equal(ms_rating_2);
        expect(allRepoReviews[1].milestoneId).to.equal(milestoneId_1);

        expect(allRepoReviews[2].repository).to.equal(repositoryContract.address);
        expect(allRepoReviews[2].reviewer).to.equal(testUser.address);
        expect(allRepoReviews[2].reviewerSkillLevel).to.equal(ms_reviewerSkillLevel_3);
        expect(allRepoReviews[2].contentIdentifier).to.equal(ms_contentIdentifier_3);
        expect(allRepoReviews[2].rating).to.equal(ms_rating_3);
        expect(allRepoReviews[2].milestoneId).to.equal(milestoneId_2);
    });

    it("Check if reviewer get paid for review", async function () {
        const reviewId = 0;
        const oldBalance = await provider.getBalance(testUser.address);
        const rewardAmount = ethers.utils.parseEther("1.0");
        const payReviewer = await repositoryfactory.connect(admin).payReviewer(testUser.address, reviewId, {value: rewardAmount,});
        const result = await payReviewer.wait();
        const reviewRewardedEvent = result.events[0];

        const newBalance = await provider.getBalance(testUser.address);
        expect(newBalance).to.equal(oldBalance.add(ethers.utils.parseEther("1.0")));

        expect(reviewRewardedEvent.args.reviewer).to.equal(testUser.address);
        expect(reviewRewardedEvent.args.reviewId).to.equal(reviewId);
        expect(reviewRewardedEvent.args.reward).to.equal(rewardAmount);
    });
});

describe("Role Manager", function () {
    let repository;
    let admin, contributor, testUser, randomUser;

    before(async () => {
        [admin, contributor, testUser, randomUser] = await ethers.getSigners();
        const Repository = await ethers.getContractFactory("Repository");
        repository = await Repository.deploy("meno","description",admin.address);
        await repository.deployed();
    });

    it("Set contributor privilege to address as admin", async function () {
        const conName = "contributor"
        const setConTx = await repository.connect(admin).setPrivillegeContributor(contributor.address, conName);
        const resultCon = await setConTx.wait();
        const conAddedEvent = resultCon.events[0];

        expect(conAddedEvent.args[0]).to.equal(await(repository.CONTRIBUTOR_ROLE()));
        expect(conAddedEvent.args[1]).to.equal(contributor.address);
        expect(conAddedEvent.args[2]).to.equal(admin.address);

        expect(await repository.hasRole(repository.CONTRIBUTOR_ROLE(), contributor.address)).to.equal(true);
        expect((await repository.usersInfo(contributor.address)).name).to.equal(conName);
        expect((await repository.usersInfo(contributor.address)).id).to.equal(1);
    });

    it("Fail set contributor privilege to address as contributor", async function () {
        const conName2 = "contributor2"

        await expect(repository.connect(contributor).setPrivillegeContributor(testUser.address, conName2)).to.be.reverted;
    });

    it("Fail set contributor privilege by different user as admin", async function () {
        const conName3 = "contributor3"

        await expect(repository.connect(contributor).setPrivillegeContributor(randomUser.address, conName3)).to.be.reverted;
        await expect(repository.connect(testUser).setPrivillegeContributor(randomUser.address, conName3)).to.be.reverted;
    });

});
describe("Repository", function () {
    let repository;
    let admin, con1, testUser;

    let ipfs_hash = "ipfs_hash"
    let version_name = "my_version_name"

    let ipfs_hash_2 = "ipfs_hash_2"
    let version_name_2 = "my_version_name_2"

    let ipfs_hash_3 = "ipfs_hash_3"
    let version_name_3 = "my_version_name_3"

    let ipfs_hash_4 = "ipfs_hash_4"
    let version_name_4 = "my_version_name_4"

    const deadline = 2025;
    const title = "Milestone1";
    const description = "descript-001";

    const deadline_1 = 2028;
    const title_1 = "Milestone2";
    const description_1 = "descript-002";

    const deadline_2 = 2030;
    const title_2 = "Milestone3";
    const description_2 = "descript-003";

    const numberOfRequiredReviews = 1;

    before(async () => {
        [admin, con1, testUser] = await ethers.getSigners();
        const Repository = await ethers.getContractFactory("Repository");
        repository = await Repository.deploy("repository_name", "repository_description", admin.address);
        await repository.deployed();
    });

    it("Add version", async function() {
        const setVersionTx = await repository.connect(admin).addVersionOfRepository(version_name, ipfs_hash);
        const result = await setVersionTx.wait();
        const versionAddedEvent = result.events[0];

        expect(versionAddedEvent.args[0]).to.equal(admin.address);
        expect(versionAddedEvent.args[1]).to.equal(version_name);

        expect((await repository.getLatestVersion()).committer).to.equal(admin.address);
        expect((await repository.getLatestVersion()).commitName).to.equal(version_name);
        expect((await repository.getLatestVersion()).ipfsHash).to.equal(ipfs_hash);
    });

    it("Add second version", async function() {
        const setVersionTx = await repository.connect(admin).addVersionOfRepository(version_name_2, ipfs_hash_2);
        const result = await setVersionTx.wait();
        const versionAddedEvent = result.events[0];

        expect(versionAddedEvent.args[0]).to.equal(admin.address);
        expect(versionAddedEvent.args[1]).to.equal(version_name_2);

        expect((await repository.getLatestVersion()).committer).to.equal(admin.address);
        expect((await repository.getLatestVersion()).commitName).to.equal(version_name_2);
        expect((await repository.getLatestVersion()).ipfsHash).to.equal(ipfs_hash_2);
        expect((await repository.getVersionsHashes()).length).to.equal(2);
    });

    it("Add contributor to repo", async function() {
        const conName = "contributor";
        const setConTx = await repository.connect(admin).setPrivillegeContributor(con1.address, conName);
        await setConTx.wait();

        const allContributors = await repository.getContributors();

        expect(allContributors.length).to.equal(2);
        expect(allContributors[0]).to.equal(admin.address);
        expect(allContributors[1]).to.equal(con1.address);

        expect(await repository.hasRole(repository.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
        expect((await repository.usersInfo(admin.address)).name).to.equal("Owner");
        expect((await repository.usersInfo(admin.address)).id).to.equal(0);

        expect(await repository.hasRole(repository.CONTRIBUTOR_ROLE(), con1.address)).to.equal(true);
        expect((await repository.usersInfo(con1.address)).name).to.equal(conName);
        expect((await repository.usersInfo(con1.address)).id).to.equal(1);
    });

    it("Add third version by contributor", async function() {
        const setVersionTx = await repository.connect(con1).addVersionOfRepository(version_name_3, ipfs_hash_3);
        const result = await setVersionTx.wait();
        const versionAddedEvent = result.events[0];

        expect(versionAddedEvent.args[0]).to.equal(con1.address);
        expect(versionAddedEvent.args[1]).to.equal(version_name_3);

        expect((await repository.getLatestVersion()).committer).to.equal(con1.address);
        expect((await repository.getLatestVersion()).commitName).to.equal(version_name_3);
        expect((await repository.getLatestVersion()).ipfsHash).to.equal(ipfs_hash_3);
        expect((await repository.getVersionsHashes()).length).to.equal(3);
    });

    it("Fail add version by random user", async function () {
        await expect(repository.connect(testUser).addVersionOfRepository(version_name_4, ipfs_hash_4)).to.be.reverted;
    });

    it("Get previous versions", async function () {
        let hashes = await repository.getVersionsHashes()
        let version1 = await repository.getVersion(hashes[0])
        let version2 = await repository.getVersion(hashes[1])
        let version3 = await repository.getVersion(hashes[2])

        expect(version1.committer).to.equal(admin.address);
        expect(version1.commitName).to.equal(version_name);
        expect(version1.ipfsHash).to.equal(ipfs_hash);

        expect(version2.committer).to.equal(admin.address);
        expect(version2.commitName).to.equal(version_name_2);
        expect(version2.ipfsHash).to.equal(ipfs_hash_2);

        expect(version3.committer).to.equal(con1.address);
        expect(version3.commitName).to.equal(version_name_3);
        expect(version3.ipfsHash).to.equal(ipfs_hash_3);
    });

    it("Add milestones", async function () {
        const addMilestoneTx = await repository.connect(admin).addMilestone(deadline, title, description);
        const result = await addMilestoneTx.wait();
        const milestoneAddedEvent = result.events[0];

        expect(milestoneAddedEvent.args.id).to.equal(0);
        expect(milestoneAddedEvent.args.deadline).to.equal(deadline);
        expect(milestoneAddedEvent.args.milestoneName).to.equal(title);
        expect(milestoneAddedEvent.args.milestoneDescription).to.equal(description);

        expect((await repository.getAllMilestones()).length).to.equal(1);

        const addVersionTx2 = await repository.connect(admin).addMilestone(deadline_1, title_1, description_1);
        const result2 = await addVersionTx2.wait();
        const milestoneAddedEvent2 = result2.events[0];

        expect(milestoneAddedEvent2.args.id).to.equal(1);
        expect(milestoneAddedEvent2.args.deadline).to.equal(deadline_1);
        expect(milestoneAddedEvent2.args.milestoneName).to.equal(title_1);
        expect(milestoneAddedEvent2.args.milestoneDescription).to.equal(description_1);

        expect((await repository.getAllMilestones()).length).to.equal(2);
    });

    it("Fail add milestone by different user as admin", async function () {
        await expect(repository.connect(con1).addMilestone(deadline_2, title_2, description_2)).to.be.reverted;
        await expect(repository.connect(testUser).addMilestone(deadline_2, title_2, description_2)).to.be.reverted;
    });

    it("Complete first milestone", async function () {
        const allMilestones = await repository.getAllMilestones();

        expect(await repository.isMilestoneReviewable(allMilestones[0].id)).to.equal(false);
        expect(await repository.isRepositoryReviewable()).to.equal(false);

        const completeMileTx = await repository.connect(admin).completeMilestone(allMilestones[0].id, numberOfRequiredReviews);
        const result = await completeMileTx.wait();
        const completeMileEvent = result.events[0];

        expect(completeMileEvent.args.id).to.equal(0);
        expect(completeMileEvent.args.numberOfReviews).to.equal(numberOfRequiredReviews);
    });

    it("Check reviewable milestones", async function () {
        const allMilestones = await repository.getAllMilestones();
        const allRevMilestones = await repository.getAllReviewableMilestones();

        expect(allMilestones.length).to.equal(2);
        expect(allRevMilestones.length).to.equal(1);
        expect(await repository.isMilestoneReviewable(allMilestones[0].id)).to.equal(true);
        expect(await repository.isMilestoneReviewable(allMilestones[1].id)).to.equal(false);

        expect(allRevMilestones[0].id).to.equal(0);
        expect(allRevMilestones[0].title).to.equal(title);
        expect(allRevMilestones[0].deadline).to.equal(deadline);
        expect(allRevMilestones[0].description).to.equal(description);
        expect(allRevMilestones[0].completed).to.equal(true);
    });

    it("Fail complete milestone by different user as admin", async function () {
        const milestoneId = 1;

        await expect(repository.connect(con1).completeMilestone(milestoneId, numberOfRequiredReviews)).to.be.reverted;
        await expect(repository.connect(testUser).completeMilestone(milestoneId, numberOfRequiredReviews)).to.be.reverted;
    });

    it("Check if is repository reviewable", async function () {
        expect(await repository.isRepositoryReviewable()).to.equal(true);
    });

});

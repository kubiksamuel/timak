const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Repository Factory", function () {
    let repositoryfactory;
    let admin;

    before(async () => {
        [admin] = await ethers.getSigners();
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
        const repo = await repositoryfactory.createRepositoryContract("repo1","descript1");
        const event = await repo.wait();
        const addNewRepositorySet = event.events[4];

        expect(addNewRepositorySet.args.name).to.equal("repo1");
        expect((await repositoryfactory.getAllRepositories()).length).to.equal(1);
        expect((await repositoryfactory.getUsers()).length).to.equal(1);
        account = event.events[4].args.owner;
        expect((await repositoryfactory.getUserRepos(account)).length).to.equal(1);
    });

    it("Create 2 repos by one user", async function () {
        const repo = await repositoryfactory.createRepositoryContract("repo2","descript2");
        const event = await repo.wait();
        const addNewRepositorySet = event.events[4];

        expect(addNewRepositorySet.args.name).to.equal("repo2");
        expect((await repositoryfactory.getAllRepositories()).length).to.equal(2);
        expect((await repositoryfactory.getUsers()).length).to.equal(1);
        account = event.events[4].args.owner;
        expect((await repositoryfactory.getUserRepos(account)).length).to.equal(2);
    });

    it("Add 2 user", async function () {
        const user2 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
        const repo = await repositoryfactory.addUser(user2);
        await repo.wait();

        expect((await repositoryfactory.getUsers()).length).to.equal(2);
        expect((await repositoryfactory.getUserRepos(user2)).length).to.equal(0);
    });

    it("Check if user is user", async function () {
        const user2 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
        const random_addr = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
        expect((await repositoryfactory.isAlreadyUser(user2))).to.equal(true);
        expect((await repositoryfactory.isAlreadyUser(random_addr))).to.equal(false);
    });
});

describe("Role Manager", function () {
    let repository;
    let admin;
    //let addr = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"

    before(async () => {
        [admin, contributor, testUser] = await ethers.getSigners();
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

    it("Fail set contributor privilege to address as random user", async function () {
        const conName3 = "contributor3"
        let random_user = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"

        await expect(repository.connect(testUser).setPrivillegeContributor(random_user, conName3)).to.be.reverted;
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

    before(async () => {
        [admin, con1, testUser] = await ethers.getSigners();
        const Repository = await ethers.getContractFactory("Repository");
        repository = await Repository.deploy("meno", "description", admin.address);
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

    it("Add third version by contributor", async function() {
        const conName = "contributor"
        const setConTx = await repository.connect(admin).setPrivillegeContributor(con1.address, conName);
        await setConTx.wait();

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

});

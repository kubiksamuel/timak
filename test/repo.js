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

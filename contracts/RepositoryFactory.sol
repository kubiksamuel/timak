// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Repository.sol";

contract RepositoryFactory {
    event NewRepositorySet(string name, uint256 createdAt, address owner, Repository repository);

    Repository[] public repositories;
    uint256 public userCounter;

    struct User {
        uint id;
        Repository[] listOfRepositories;
    }

    struct Review {
        address repository;
        address reviewer;
        // uint reviewerSkillLevel;
        // bytes32 contentIdentifier;
        string description;
        // bytes32 versionId;
    }

    mapping(address => uint[]) internal repositoryReview;
    mapping(address => uint[]) internal reviewerReview;
    mapping(address => User) internal usersData;
    address[] public users;
    Review[] public reviews;

    function createRepositoryContract(string memory _name, string memory _description) public {
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Repository repository = new Repository(_name, _description);
        repositories.push(repository);
        usersData[msg.sender].listOfRepositories.push(repository);
        emit NewRepositorySet(_name, block.timestamp, msg.sender, repository);
    }

    function createReview(address _repository, string memory _description) public {
        //TODO if repository toReview == true
        //TODO all parameters
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Review memory newReview = Review(_repository, msg.sender, _description);
        reviews.push(newReview);
        repositoryReview[_repository].push(reviews.length - 1);
        reviewerReview[msg.sender].push(reviews.length - 1);
    }

    function getUserReviewScore(address user) external view returns (uint) {
        return reviewerReview[user].length;
    }


    function getUserRepos(address user) external view returns (Repository[] memory) {
        return usersData[user].listOfRepositories;
    }

    function getAllRepositories() public view returns (Repository[] memory) {
        return repositories;
    }

    function getUsers() external view returns (address[] memory) {
        return users;
    }
}

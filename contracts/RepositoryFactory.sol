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

    mapping(address => User) internal usersData;
    address[] public users;

    function createRepositoryContract(string memory _name, string memory _description) public{
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Repository repository = new Repository(_name, _description, msg.sender);
        repositories.push(repository);
        usersData[msg.sender].listOfRepositories.push(repository);
        emit NewRepositorySet(_name, block.timestamp, msg.sender, repository);
    }

    function addUser(address user)public
    {
        userCounter++;
        usersData[user].id = userCounter;
        users.push(user);
    }

    function addRepositoryToUser(address user, Repository repository)public{
        usersData[user].listOfRepositories.push(repository);
    }

    function getUserRepos(address user) external view returns (Repository[] memory) {
        return usersData[user].listOfRepositories;
    }

    function getUsers() external view returns(address[] memory){
        return users;
    }

    function isAlreadyUser(address user) external view returns (bool){
        if (usersData[user].id == 0) {
            return false;
        }
        return true;
    }

}

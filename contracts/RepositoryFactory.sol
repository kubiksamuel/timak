// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Repository.sol";

contract RepositoryFactory {
    mapping(bytes32 => Repository) public repositories;
    bytes32[] public repoHashes;

    struct User {
        bytes32[] listOfRepositories;
    }

    mapping(address => User) internal usersData;
    address[] public users;

    function createRepositoryContract(string memory _name) public{
        Repository repository = new Repository(_name);
        bytes32 repoHash;
        repoHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        repositories[repoHash] = repository;
        repoHashes.push(repoHash);
        usersData[msg.sender].listOfRepositories.push(repoHash);
        users.push(msg.sender);
    }

    function getUserRepos(address user) external view returns (bytes32[] memory) {
        return usersData[user].listOfRepositories;
    }

}

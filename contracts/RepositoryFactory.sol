// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Repository.sol";

contract RepositoryFactory {
    event NewRepositorySet(string name, uint256 createdAt, address owner);

    mapping(bytes32 => Repository) public repositories;
    bytes32[] public repoHashes;

    struct User {
        bytes32[] listOfRepositories;
    }

    Repository[] public repositoriess;

    mapping(address => User) internal usersData;
    address[] public users;

    function createRepositoryContract(string memory _name, string memory _description) public{
        Repository repository = new Repository(_name, _description);
        repositoriess.push(repository);
        bytes32 repoHash;
        repoHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        repositories[repoHash] = repository;
        repoHashes.push(repoHash);
        usersData[msg.sender].listOfRepositories.push(repoHash);
        users.push(msg.sender);
        emit NewRepositorySet(_name, block.timestamp, msg.sender);
    }

    function getUserRepos(address user) external view returns (bytes32[] memory) {
        return usersData[user].listOfRepositories;
    }

    function getAllRepositories() public view returns(Repository[] memory){
        return repositoriess;
    }
}

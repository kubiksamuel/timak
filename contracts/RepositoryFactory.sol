// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Repository.sol";

contract RepositoryFactory {
    Repository[] public repositories;


    function createRepositoryContract(string memory _name) public{
        Repository repository = new Repository(_name);
        repositories.push(repository);
    }

    function getAllRepositories() public view returns(Repository[] memory){
        return repositories;
    }


}
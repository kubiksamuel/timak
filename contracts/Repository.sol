// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager("Administrator"){
    event VersionAdded(address committer, string versionName, uint256 timestamp);
    event RepositoryCreated(string name, uint256 createdAt, address owner, string description);

    string public name;
    uint256 public createdAt;
    address public owner;
    string public description;

    struct Version {
        uint256 timestamp;
        address committer;
        string commitName;
    }

    struct Milestone {
        uint256 timestamp;
        address committer;
        string name;
    }

    mapping(bytes32 => Version) public version;
    bytes32[] public versionHashes;

    constructor(string memory _name, string memory _description) {
        name = _name;
        createdAt = block.timestamp;
        owner = msg.sender;
        description = _description;
        emit RepositoryCreated(_name, createdAt, owner, _description);
    }

    function addVersionOfRepository(string memory _name) public
        onlyRole(CONTRIBUTOR_ROLE)
    {
        bytes32 versionHash;
        versionHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        Version storage newVersion = version[versionHash];
        newVersion.timestamp = block.timestamp;
        newVersion.committer = msg.sender;
        newVersion.commitName = _name;
        versionHashes.push(versionHash);
        emit VersionAdded(msg.sender, _name, block.timestamp);
    }

}

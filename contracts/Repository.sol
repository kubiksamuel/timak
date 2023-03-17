// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager("Administrator"){
    string public name;
    uint256 public createdAt;
    address public owner;

    struct Version {
        uint256 timestamp;
        address committer;
        string commitName;
    }

    mapping(bytes32 => Version) public version;
    bytes32[] public versionHashes;

    constructor(string memory _name) {
        name = _name;
        createdAt = block.timestamp;
        owner = msg.sender;
    }

    function addVersionOfRepository(string memory _name) public {
        bytes32 versionHash;
        versionHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        Version storage newVersion = version[versionHash];
        newVersion.timestamp = block.timestamp;
        newVersion.committer = msg.sender;
        newVersion.commitName = _name;
        versionHashes.push(versionHash);
    }

}

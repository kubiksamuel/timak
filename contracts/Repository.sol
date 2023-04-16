// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager(){
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
        string ipfsHash;
    }

    struct Milestone {
        uint256 timestamp;
        address committer;
        string name;
    }

    mapping(bytes32 => Version) public version;
    bytes32[] public versionHashes;

    constructor(string memory _name, string memory _description, address _user) {
        userId = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, _user);
        grantRole(CONTRIBUTOR_ROLE, _user);
        usersInfo[msg.sender].name = "ADMINISTRATOR";
        usersInfo[msg.sender].id = userId;
        contributors.push(_user);


        name = _name;
        createdAt = block.timestamp;
        owner = _user;
        description = _description;
        emit RepositoryCreated(_name, createdAt, owner, _description);
    }

    function addVersionOfRepository(string memory _name, string memory _ipfsHash, address _sender) public
    onlyRole(CONTRIBUTOR_ROLE)
    {
        bytes32 versionHash;
        versionHash = keccak256(abi.encodePacked(_sender, block.timestamp));
        Version storage newVersion = version[versionHash];
        newVersion.timestamp = block.timestamp;
        newVersion.committer = _sender;
        newVersion.commitName = _name;
        newVersion.ipfsHash = _ipfsHash;
        versionHashes.push(versionHash);
        emit VersionAdded(_sender, _name, block.timestamp);
    }

    function addContributor(address contributor, string memory _name) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        setPrivillegeContributor(contributor, _name);
    }

    function getContributors() external view returns(address[] memory){
        return contributors;
    }

    function getVersionHashes() external view returns(bytes32[] memory){
        return versionHashes;
    }

    function getVersion(bytes32 hash) external view returns(Version memory){
        return version[hash];
    }
}

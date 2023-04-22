// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager{
    event VersionAdded(address committer, string versionName, uint256 timestamp);
    event MilestoneAdded(uint256 id, uint256 deadline, string milestoneName, string  milestoneDescription, bool requestReview);
    event RepositoryCreated(string name, uint256 createdAt, address owner, string description);

    string public name;
    uint256 public createdAt;
    address public owner;
    string public description;
    bool public toReview;
    uint public numberOfReviews;

    struct Version {
        uint256 timestamp;
        address committer;
        string commitName;
    }

    struct Milestone {
        uint256 id;
        uint256 deadline;
        string title;
        string description;
        bool requestReview;
        bool completed;
    }

    Milestone[] public milestones;

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
        toReview = false;
        numberOfReviews = 0;
        emit RepositoryCreated(_name, createdAt, owner, _description);
    }

    function addMilestone(uint256 deadline, string memory _title, string memory _description, bool _requestReview) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Milestone memory newMilestone = Milestone(milestones.length, deadline, _title, _description, _requestReview, false);
        milestones.push(newMilestone);
        emit MilestoneAdded(newMilestone.id, newMilestone.deadline, newMilestone.title, newMilestone.description, newMilestone.requestReview);
    }

    function getAllMilestones() external view returns(Milestone[] memory){
        return milestones;
    }

    function completeMilestone(uint256 milestoneId) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        milestones[milestoneId].completed = true;
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

    function addContributor(address contributor, string memory _name) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        setPrivillegeContributor(contributor, _name);
    }

    function getContributors() external view returns(address[] memory){
        return contributors;
    }
    function setToReview(bool _toReview) public {
        toReview = _toReview;
    }

    function setNumberOfReviews(uint _numberOfReviews) public {
        numberOfReviews = _numberOfReviews;
    }
}

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager{
    event VersionAdded(address committer, string versionName, uint256 timestamp);
    event MilestoneAdded(uint256 id, uint256 deadline, string milestoneName, string  milestoneDescription);
    event RepositoryCreated(string name, uint256 createdAt, address owner, string description);
    event MilestoneCompleted(uint256 id, uint256 numberOfReviews);

    string public name;
    uint256 public createdAt;
    address public owner;
    string public description;
    bool public toReview;

    struct Version {
        uint256 timestamp;
        address committer;
        string commitName;
    }

    struct Milestone {
        uint256 numberOfRequiredReviews;
        uint256 numberOfCommittedReviews;
        uint256 id;
        uint256 deadline;
        string title;
        string description;
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
        emit RepositoryCreated(_name, createdAt, owner, _description);
    }

    function isMilestoneReviewable(uint _index) external view returns(bool) {
        return milestones[_index].numberOfRequiredReviews > milestones[_index].numberOfCommittedReviews;
    }

    function addMilestone(uint256 deadline, string memory _title, string memory _description) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Milestone memory newMilestone = Milestone(0, 0, milestones.length, deadline, _title, _description, false);
        milestones.push(newMilestone);
        emit MilestoneAdded(newMilestone.id, newMilestone.deadline, newMilestone.title, newMilestone.description);
    }

    function getAllMilestones() external view returns(Milestone[] memory){
        return milestones;
    }

    function incrementReviewCount(uint256 _milestoneId) public{
        milestones[_milestoneId].numberOfCommittedReviews++;
        if(this.isRepositoryReviewable() == false){
            this.setToReview(false);
        }
    }

    function completeMilestone(uint256 _milestoneId, uint256 _numberOfRequiredReviews) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        milestones[_milestoneId].completed = true;
        if (_numberOfRequiredReviews > 0){
            milestones[_milestoneId].numberOfRequiredReviews = _numberOfRequiredReviews;
            toReview = true;
        }
        emit MilestoneCompleted(_milestoneId, _numberOfRequiredReviews);
    }

    function setToReview(bool _val) public {
        toReview = _val;
    }

    function isRepositoryReviewable() external view returns (bool){
        for (uint i = 0; i< milestones.length; i++){
            if(milestones[i].numberOfRequiredReviews != milestones[i].numberOfCommittedReviews){
                return true;
            }
        }
        return false;
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

    function getLastCompletedMilestone() external view returns(Milestone memory) {
        for (uint i = 0; i< milestones.length; i++){
            if(milestones[i].completed == true){
                return milestones[i];
            }
        }
        revert('Not found');
    }
}

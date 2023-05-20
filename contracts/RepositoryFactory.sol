// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Repository.sol";

contract RepositoryFactory {
    event NewRepositorySet(string name, uint256 createdAt, address owner, Repository repository);
    event ReviewAdded(address indexed repository, address indexed reviewer, uint reviewerSkillLevel, string contentIdentifier, uint rating, uint milestoneId);
    // error NotReviewable(string contentIdentifier);

    Repository[] public repositories;
    uint256 public userCounter;

    struct User {
        uint id;
        Repository[] listOfRepositories;
    }

    struct Review {
        address repository;
        address reviewer;
        uint reviewerSkillLevel;
        string contentIdentifier;
        uint rating;
        uint milestoneId;
    }

    mapping(address => Repository) internal repositoryMapping;
    mapping(address => uint[]) internal repositoryReview;
    mapping(address => uint[]) internal reviewerReview;
    mapping(address => User) internal usersData;
    address[] public users;
    Review[] public reviews;

    function getRepositoryByHash(address repositoryHash) external view returns (Repository) {
        return repositoryMapping[repositoryHash];
    }

    function createRepositoryContract(string memory _name, string memory _description) public {
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Repository repository = new Repository(_name, _description, msg.sender);
        repositories.push(repository);
        repositoryMapping[address(repository)] = repository;
        usersData[msg.sender].listOfRepositories.push(repository);
        emit NewRepositorySet(_name, block.timestamp, msg.sender, repository);
    }

    function createReview(address _repository, string memory _contentIdentifier, uint _rating, uint _reviewerSkillLevel, uint _milestoneId) public {
        if(repositoryMapping[_repository].toReview() == true && repositoryMapping[_repository].isMilestoneReviewable(_milestoneId)==true){
            if (usersData[msg.sender].id == 0) {
                userCounter++;
                usersData[msg.sender].id = userCounter;
                users.push(msg.sender);
            }
            Review memory newReview = Review(_repository, msg.sender, _reviewerSkillLevel, _contentIdentifier, _rating, _milestoneId);
            reviews.push(newReview);
            repositoryReview[_repository].push(reviews.length - 1);
            reviewerReview[msg.sender].push(reviews.length - 1);
            repositoryMapping[_repository].incrementReviewCount(_milestoneId);
            emit ReviewAdded(_repository, msg.sender, _reviewerSkillLevel, _contentIdentifier, _rating, _milestoneId);
        }
        else{
            revert ();
        }
    }



    function getRepositoryReviews(address _repository) external view returns (Review[] memory repositoryReviews) {
        Review[] memory tmp = new Review[](repositoryReview[_repository].length);
        for(uint i = 0; i < repositoryReview[_repository].length; i++ ){
            tmp[i] = reviews[repositoryReview[_repository][i]];
        }
        repositoryReviews = tmp;
    }

    function getReviewableRepositories() external view returns(Repository[] memory reviewableRepository){
        uint counter = 0;
        for (uint i = 0; i < repositories.length; i++ ){
            if (repositories[i].toReview()){
                counter++;
            }
        }
        Repository[] memory tmpReviewableRepository = new Repository[](counter);
        for (uint i = 0; i< repositories.length; i++){
            if (repositories[i].toReview()){
                tmpReviewableRepository[i] = repositories[i];
            }

        }
        reviewableRepository = tmpReviewableRepository;
    }

    function getUserReviewScore(address user) external view returns (uint) {
        return reviewerReview[user].length;
    }

    function getRepositoryReviewsLength(address _repository) external view returns (uint) {
        return repositoryReview[_repository].length;
    }


    function addUser(address user)public
    {
        userCounter++;
        usersData[user].id = userCounter;
        users.push(user);
    }

    function addRepositoryToUser(address user, Repository repository, string memory _name)public{
        if(!this.isAlreadyUser(user)){
            this.addUser(user);
        }
        repository.addContributor(user, _name);
        usersData[user].listOfRepositories.push(repository);
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

    function isAlreadyUser(address user) external view returns (bool){
        if (usersData[user].id == 0) {
            return false;
        }
        return true;
    }

}

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

    struct Review {
        address repository;
        address reviewer;
        uint reviewerSkillLevel;
        string contentIdentifier;
        //        bytes32 contentIdentifier;
        uint rating;
        // bytes32 versionId;
    }

    mapping(address => Repository) internal repositoryMapping;
    mapping(address => uint[]) internal repositoryReview;
    mapping(address => uint[]) internal reviewerReview;
    mapping(address => User) internal usersData;
    address[] public users;
    Review[] public reviews;

    function createRepositoryContract(string memory _name, string memory _description) public {
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Repository repository = new Repository(_name, _description);
        repositories.push(repository);
        repositoryMapping[address(repository)] = repository;
        usersData[msg.sender].listOfRepositories.push(repository);
        emit NewRepositorySet(_name, block.timestamp, msg.sender, repository);
    }

    // function createReview(address _repository, string memory _description) public {
    //     if(repositoryMapping[_repository].toReview() == true && repositoryMapping[_repository].numberOfReviews() > repositoryReview[_repository].length){
    //     //TODO all parameters
    //         if (usersData[msg.sender].id == 0) {
    //             userCounter++;
    //             usersData[msg.sender].id = userCounter;
    //             users.push(msg.sender);
    //         }
    //         Review memory newReview = Review(_repository, msg.sender, _description);
    //         reviews.push(newReview);
    //         repositoryReview[_repository].push(reviews.length - 1);
    //         reviewerReview[msg.sender].push(reviews.length - 1);
    //     }
    // }

    function createReview(address _repository, string memory _contentIdentifier, uint _rating, uint _reviewerSkillLevel) public {
        if (usersData[msg.sender].id == 0) {
            userCounter++;
            usersData[msg.sender].id = userCounter;
            users.push(msg.sender);
        }
        Review memory newReview = Review(_repository, msg.sender, _reviewerSkillLevel, _contentIdentifier, _rating );
        reviews.push(newReview);
        repositoryReview[_repository].push(reviews.length - 1);
        reviewerReview[msg.sender].push(reviews.length - 1);
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
            if (repositories[i].toReview() == true){
                counter++;
            }
        }
        Repository[] memory tmpReviewableRepository = new Repository[](counter);
        for (uint i = 0; i< repositories.length; i++){
            if (repositories[i].toReview() == true){
                tmpReviewableRepository[i] = repositories[i];
            }

        }
        reviewableRepository = tmpReviewableRepository;
    }

    function getUserReviewScore(address user) external view returns (uint) {
        return reviewerReview[user].length;
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
}

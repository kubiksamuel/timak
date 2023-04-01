// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity >=0.7.0 <0.9.0;

contract RoleManager is AccessControl {
    event RoleGranted(address account, string name, string roleName);
    event RoleRevoked(address account, string roleName);

    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    uint256 public userId;

    mapping(address => RoleInfo) public usersInfo;
    // list of all addresses that has some role
    address[] public users;

    struct RoleInfo {
        uint id;
        string name;
    }

    constructor(string memory name)
    {
        userId = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(CONTRIBUTOR_ROLE, msg.sender);
        usersInfo[msg.sender].name = name;
        usersInfo[msg.sender].id = userId;
        users.push(msg.sender);
        emit RoleGranted(msg.sender, name, "Contributor");
    }

    function setPrivillegeContributor(address account, string memory name) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(CONTRIBUTOR_ROLE, account);
        userId++;
        usersInfo[account].id = userId;
        usersInfo[account].name = name;
        users.push(account);
        emit RoleGranted(account, name, "Administrator");
    }

    function revokeContributorRole(address account) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(CONTRIBUTOR_ROLE, account);
        delete users[usersInfo[account].id];
        emit RoleRevoked(account, "Contributor");
    }


}

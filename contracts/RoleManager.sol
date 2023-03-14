// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity >=0.7.0 <0.9.0;

contract RoleManager is AccessControl {

    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    uint256 public roleId;

    event MemberAdded(address account, string name, string role);

    mapping(address => RoleInfo) public rolesInfo;
    // list of all addresses that has some role 
    address[] public roles;

    struct RoleInfo {
        uint id;
        string name;
    }

    constructor(string memory name) 
    {
        roleId = 1;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(CONTRIBUTOR_ROLE, msg.sender);
        rolesInfo[msg.sender].name = name;
        rolesInfo[msg.sender].id = roleId;
        roles.push(msg.sender);
    }

    function setPrivillegeContributor(address account, string memory name) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(rolesInfo[account].id == 0, "Account already have some privillege");
        grantRole(CONTRIBUTOR_ROLE, account);
        roleId++;
        rolesInfo[account].id = roleId;
        rolesInfo[account].name = name;
        roles.push(account);
        emit MemberAdded(account, name, "contributor");
    }


}
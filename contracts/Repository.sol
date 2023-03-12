// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./RoleManager.sol";

contract Repository is RoleManager("Administrator"){
    string public name;
    uint256 public timestamp;
    address public owner;

    struct File {
        string name;
    }

    File[] public files;

    constructor(string memory _name) {
        name = _name;
        timestamp = block.timestamp;
        owner = msg.sender;
    }

    function addToFiles(string memory _name) public {
        files.push(File({
            name: _name
        }));
    }

}

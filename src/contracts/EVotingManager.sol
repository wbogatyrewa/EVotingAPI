// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract EVotingManager {
    address public owner;
    address[] eVotings; // address chairperson => address evoting

    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }

    function getEVotings() view public returns (address[] memory) {
        return eVotings;
    }

    function addEVoting(address _eVoting) public {
        require(
            msg.sender == owner,
            "Only owner can add voting."
        );
        eVotings.push(_eVoting);
    }
}
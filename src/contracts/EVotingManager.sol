// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract EVotingManager {
    address[] eVotings; // address chairperson => address evoting

    function getEVotings() view public returns (address[] memory) {
        return eVotings;
    }

    function addEVoting(address _eVoting) public {
        eVotings.push(_eVoting);
    }
}
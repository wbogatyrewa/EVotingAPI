// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./EVotingToken.sol";

contract EVoting {
    string name; 
    uint startTime;
    uint endTime;
    address chairperson;
    EVotingToken token = new EVotingToken();

    address[] votersAddresses;
    mapping (address => bool) voters; // {address of voter => voted}
    mapping (address => bool) votersExist;
    mapping (address => address) votesFor;

    address[] proposalsAddresses;
    string[] proposalsNames;
    mapping (address => string) proposals; // {address of proposal => name of proposal}
    mapping (address => bool) proposalsExist;

    constructor (string memory _name, uint _startTime, uint _endTime,
                address[] memory _voters, 
                address[] memory _proposalsAddr, 
                string[] memory _proposalsNames) {
        chairperson = msg.sender; // owner
        name = _name;
        startTime = _startTime;
        endTime = _endTime;

        votersAddresses = _voters;
        proposalsAddresses = _proposalsAddr;
        proposalsNames = _proposalsNames;
        addVoters(_voters);
        addProposals(_proposalsAddr, _proposalsNames);
    }

    modifier onlyChairperson() {
        require(msg.sender == chairperson, 
                "This isn't chairperson.");
        _;
    }
    
    modifier voteIsOn() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, 
                "Voting completed.");
        _;
    }

    function addVoters(address[] memory _voters) public onlyChairperson {
        for (uint i = 0; i < _voters.length; i++) {
            require(!proposalsExist[_voters[i]], "Proposal can't be voter.");
            require(!votersExist[_voters[i]], "Voter exists.");
    
            voters[_voters[i]] = false;
            votersExist[_voters[i]] = true;
            token.mint(_voters[i], 1); 
        }
    }

    function addProposals(address[] memory _proposalsAddr, 
                          string[] memory _proposalsNames) public onlyChairperson {
        require(_proposalsAddr.length == _proposalsNames.length, "Length is different.");

        for (uint i = 0; i < _proposalsAddr.length; i++) {
            proposals[_proposalsAddr[i]] = _proposalsNames[i];
            proposalsExist[_proposalsAddr[i]] = true;
        }
    }

    function vote(address proposal) public voteIsOn {
        require(votersExist[msg.sender], "Voter doesn't exist.");
        require(token.balanceOf(msg.sender) > 0, "Token doesn't exist.");
        require(proposalsExist[proposal], "Proposal doesn't exist.");
        require(!voters[msg.sender], "Voter already voted.");

        token.transfer(proposal, 1);
        voters[msg.sender] = true;
        votesFor[msg.sender] = proposal;
    }

    function totalVotesFor(address proposal) view public returns (uint256) {
        require(proposalsExist[proposal], "Proposal doesn't exist.");
        return token.balanceOf(proposal);
    }

    function voteFor(address voter) view public returns (address) {
        require(votersExist[voter], "Voter doesn't exist.");
        return votesFor[voter];
    }

        function getName() view public returns(string memory) {
        return name;
    }

    function getStartTime() view public returns(uint) {
        return startTime;
    }

    function getEndTime() view public returns(uint) {
        return endTime;
    }

    function getVoters() view public returns(address[] memory) {
        return votersAddresses;
    }

    function getPropposalsAddresses() view public returns(address[] memory) {
        return proposalsAddresses;
    }

    function getPropposalsNames() view public returns(string[] memory) {
        return proposalsNames;
    }

    function nameOfProposal(address proposal) view public returns (string memory) {
        require(proposalsExist[proposal], "Proposal doesn't exist.");
        
        return proposals[proposal];
    }
}
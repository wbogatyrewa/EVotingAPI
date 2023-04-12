<img src="Logo.png" alt="EVoting Logo" width="150px" />

## What is EVotingAPI?
This is a public API for `EVoting` - an electronic voting system based on the blockchain technology.

## Methods
- GET `/get-voting-list`: method returns an array of voting.
- POST `/create-voting`: the method allows you to deploy a smart contract to the blockchain Sepolia test network. Arguments: voting name, start date, end date, array of public keys of participants and array of answer options. The method returns the address of the created smart contract in the blockchain.

## Quickstart
1. 💻 Download project
2. Install packages: `npm install` or `npm i`
3. ✅ Run the project locally: `npm start`
import { API_KEY, PRIVATE_KEY } from "../env.js";
import { bytecode, ABI } from "./contracts/EVotingAbi.js";
import {
  EVotingManagerAddress,
  EVotingManagerABI,
} from "./contracts/EVotingManagerAbi.js";

import { ethers, AbiCoder, ContractFactory, Contract, Wallet } from "ethers";

const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

export const createVoting = async (
  name,
  startDateTime,
  endDateTime,
  voters,
  proposalsNames
) => {
  // generate proposals address
  const proposalsAddress = proposalsNames.map(
    (name) => Wallet.createRandom().address
  );

  const encodedParameters = new AbiCoder().encode(
    ["string", "uint256", "uint256", "address[]", "address[]", "string[]"],
    [name, startDateTime, endDateTime, voters, proposalsAddress, proposalsNames]
  );
  const bytecodeWithEncoded = `${bytecode}${encodedParameters.slice(2)}`;

  const EVoting = await new ContractFactory(ABI, bytecodeWithEncoded, signer);
  // Start deployment, returning a promise that resolves to a contract object
  const eVoting = await EVoting.deploy(
    name,
    startDateTime,
    endDateTime,
    voters,
    proposalsAddress,
    proposalsNames
  );

  const address = eVoting.getAddress();

  // add voting address to EVotingManager smart contract
  const EVotingManager = await new Contract(
    EVotingManagerAddress,
    EVotingManagerABI,
    signer
  );

  const tx = await EVotingManager.addEVoting(address);

  return address;
};

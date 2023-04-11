import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { API_KEY, PRIVATE_KEY, PUBLIC_KEY, API_URL } from "../env.js";
import { bytecode, ABI } from "./contracts/EVotingAbi.js";
import { ethers, AbiCoder, ContractFactory } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folder = __dirname + "/voting_contracts";

const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

export const createVotingEthers = async (
  name,
  startDateTime,
  endDateTime,
  voters,
  proposalsAddress,
  proposalsNames
) => {
  const encodedParameters = new AbiCoder().encode(
    ["string", "uint256", "uint256", "address[]", "address[]", "string[]"],
    [name, startDateTime, endDateTime, voters, proposalsAddress, proposalsNames]
  );
  const bytecodeWithEncoded = `${bytecode}${encodedParameters.slice(2)}`;

  const HelloWorld = await new ContractFactory(
    ABI,
    bytecodeWithEncoded,
    signer
  );

  // Start deployment, returning a promise that resolves to a contract object
  const hello_world = await HelloWorld.deploy(
    name,
    startDateTime,
    endDateTime,
    voters,
    proposalsAddress,
    proposalsNames
  );
  console.log("Contract deployed to address:", hello_world.address);

  fs.writeFileSync(
    `${folder}/${hello_world.address}.json`,
    JSON.stringify(ABI)
  );
  return hello_world.address;
};

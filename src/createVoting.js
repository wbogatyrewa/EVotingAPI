import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";
import { API_KEY, PRIVATE_KEY } from "../env.js";

const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = __dirname + "/contracts";

export const createVoting = async (
  name,
  startDateTime,
  endDateTime,
  voters,
  proposals
) => {
  // Load the contract source code
  const sourceCode = await fs.readFile(
    `${folder}/contracts/EVoting.sol`,
    "utf8"
  );
  // Compile the source code and retrieve the ABI and Bytecode
  const { abi, bytecode } = compile(sourceCode, "EVoting");

  factory = new ContractFactory(abi, bytecode, signer);

  // Start deployment, returning a promise that resolves to a contract object
  const eVoting = await factory.deploy(
    name,
    startDateTime,
    endDateTime,
    voters,
    proposalsNames,
    proposalsAddress
  );

  // Store the ABI and Bytecode into a JSON file
  await fs.writeFile(
    `${folder}/voting_contracts/${eVoting.address}.json`,
    JSON.stringify(abi)
  );
};

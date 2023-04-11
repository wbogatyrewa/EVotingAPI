import path from "path";
import { fileURLToPath } from "url";
import { API_KEY, PRIVATE_KEY, PUBLIC_KEY, API_URL } from "../env.js";
import { bytecode, ABI } from "./contracts/EVotingAbi.js";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = __dirname;

export const createVoting = async (
  name,
  startDateTime,
  endDateTime,
  voters,
  proposalsAddress,
  proposalsNames
) => {
  const web3 = createAlchemyWeb3(API_URL);
  const encodedParameters = web3.eth.abi
    .encodeParameters(
      ["string", "uint", "uint", "address[]", "address[]", "string[]"],
      [
        name,
        startDateTime,
        endDateTime,
        voters,
        proposalsAddress,
        proposalsNames,
      ]
    )
    .slice(6);

  const bytecodeWithEncoded = `0x${bytecode}${encodedParameters}`;

  const contract = await new web3.eth.Contract(ABI);

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const deploy = contract.deploy({
    data: bytecodeWithEncoded,
    arguments: [
      name,
      startDateTime,
      endDateTime,
      voters,
      proposalsAddress,
      proposalsNames,
    ],
  });

  const address = web3.eth
    .sendTransaction({ ...deploy, from: PUBLIC_KEY }, PRIVATE_KEY)
    .then(function (newContractInstance) {
      return newContractInstance.options.address; // instance with the new contract address
    });
  // .send({
  //   from: PUBLIC_KEY,
  // })
  // .then(function (newContractInstance) {
  //   return newContractInstance.options.address; // instance with the new contract address
  // });

  // const nonce = 15;
  // const gasPrice = await web3.eth.getGasPrice();
  // const gasLimit = await web3.eth.estimateGas({
  //   bytecodeWithEncoded,
  // });

  // const privateKey = Buffer.from(PRIVATE_KEY, "hex");

  // const txObject = {
  //   nonce: web3.utils.toHex(nonce),
  //   gasLimit: web3.utils.toHex(gasLimit),
  //   gasPrice: web3.utils.toHex(gasPrice),
  //   data: `0x${bytecodeWithEncoded}`,
  //   chainId: 11155111,
  // };

  // const tx = new Tx(txObject);
  // tx.sign(privateKey);

  // const serializedTx = tx.serialize();
  // const raw = "0x" + serializedTx.toString("hex");

  // const txReceipt = await web3.eth.sendSignedTransaction(raw);
  // console.log("Contract Address:", txReceipt.contractAddress);

  // const factory = new ContractFactory(
  //   abi,
  //   bytecode,
  //   signer
  // );

  // // Start deployment, returning a promise that resolves to a contract object
  // const eVoting = await factory.deploy(
  //   name,
  //   startDateTime,
  //   endDateTime,
  //   voters,
  //   proposalsNames,
  //   proposalsAddress
  // );

  // Store the ABI and Bytecode into a JSON file

  // fs.writeFileSync(
  //   `${folder}/voting_contracts/${txReceipt.contractAddress}.json`,
  //   JSON.stringify(abi)
  // );
  return address;
};

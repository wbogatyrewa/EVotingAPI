import * as fs from "fs";
import { ethers } from "ethers";
import moment from "moment/moment.js";
import path from "path";
import { fileURLToPath } from "url";
import { API_KEY, PRIVATE_KEY } from "../env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const folder = __dirname + "/voting_contracts";

// результат функции: список голосований
// 1) file: abi контакта голосования
// 2) достать abi и записать его в переменную
// 3) достать данные с помощью методов голосования

export const getVotingList = async () => {
  const votingList = fs.readdirSync(folder).map(async (file) => {
    let address = file.slice(0, -5);
    let abi = JSON.parse(fs.readFileSync(folder + `/${file}`, "utf-8"));
    let contract = new ethers.Contract(address, abi, signer);

    let name = "";
    let startDateTime = new Date();
    let endDateTime = new Date();
    let voters = [];
    let proposalsAddr = [];
    let proposalsNames = [];

    name = await contract.getName();
    startDateTime = moment.unix(Number(await contract.getStartTime())).toDate();
    endDateTime = moment.unix(Number(await contract.getEndTime())).toDate();
    voters = await contract.getVoters();
    proposalsAddr = await contract.getProposalsAddresses();
    proposalsNames = await contract.getProposalsNames();

    let answers = [];
    for (let i = 0; i < proposalsAddr.length; i++) {
      answers.push({
        label: proposalsNames[i],
        address: proposalsAddr[i],
      });
    }
    let voting = {
      name: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      address: address,
      voters: voters,
      answers: answers,
    };
    return voting;
  });

  return Promise.all(await votingList);
};

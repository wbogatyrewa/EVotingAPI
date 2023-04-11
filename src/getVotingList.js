import { ethers, Contract } from "ethers";
import moment from "moment/moment.js";
import { API_KEY, PRIVATE_KEY } from "../env.js";
import { ABI } from "./contracts/EVotingAbi.js";
import {
  EVotingManagerAddress,
  EVotingManagerABI,
} from "./contracts/EVotingManagerAbi.js";

const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// результат функции: список голосований
// - получить аби контракта голосования
// - получить список адресов голосований из смарта
// - получить данные из каждого голосования
// - вернуть список данных

export const getVotingList = async () => {
  const EVotingManager = await new Contract(
    EVotingManagerAddress,
    EVotingManagerABI,
    signer
  );

  const votingAddresses = await EVotingManager.getEVotings();

  const votingList = votingAddresses.map(async (address) => {
    let contract = new ethers.Contract(address, ABI, signer);

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

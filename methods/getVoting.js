import * as fs from "fs";
import Web3 from "web3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// результат функции: список голосований
export const getVoting = (fromAddress) => {
  fromAddress = "0x0fd31002425E090C86D5500ca13CaCEcdb5A1794";
  const folder = __dirname + "/voting_contracts";

  // в цикле по директории
  const votingList = fs.readdirSync(folder).map(async (file) => {
    console.log(file);
    // 1) file: abi контакта голосования
    // 2) достать abi и записать его в переменную
    let Address = file.slice(0, -5);
    let ABI = JSON.parse(fs.readFileSync(folder + `/${file}`, "utf-8"));

    let name = "";
    let startDateTime = new Date();
    let endDateTime = new Date();
    let voters = [];
    let proposalsAddr = [];
    let proposalsNames = [];

    // 3) достать данные с помощью методов голосования
    var web3 = new Web3(Web3.givenProvider);
    var contract = await new web3.eth.Contract(ABI, Address);

    try {
      await contract.methods
        .getName()
        .call({ from: fromAddress })
        .then(function (result) {
          name = result;
        });
      await contract.methods
        .getStartDate()
        .call({ from: fromAddress })
        .then(function (result) {
          startDateTime = new Date(+result * 1000);
        });
      await contract.methods
        .getEndDate()
        .call({ from: fromAddress })
        .then(function (result) {
          endDateTime = new Date(+result * 1000);
        });
      await contract.methods
        .getVoters()
        .call({ from: fromAddress })
        .then(function (result) {
          voters = result;
        });
      await contract.methods
        .getProposalsAddress()
        .call({ from: fromAddress })
        .then(function (result) {
          proposalsAddr = result;
        });
      await contract.methods
        .getProposalsNames()
        .call({ from: fromAddress })
        .then(function (result) {
          proposalsNames = result;
        });
    } catch (error) {
      return [];
    }

    let answers = [];
    for (let i = 0; i < proposalsAddr.length; i++) {
      answers.push({
        label: proposalsNames[i],
        address: proposalsAddr[i],
      });
    }
    // вернуть Voting
    let voting = {
      name: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      address: Address,
      voters: voters,
      answers: answers,
    };
    return voting;
  });
  return votingList;
};

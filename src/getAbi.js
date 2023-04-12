import { ABI } from "./contracts/EVotingAbi.js";

// результат функции: abi голосования
export const getAbi = async () => {
  return JSON.stringify(ABI);
};

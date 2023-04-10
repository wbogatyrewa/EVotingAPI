import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folder = __dirname + "/voting_contracts";

// результат функции: abi голосования

export const getAbi = async (address) => {
  return fs.readFileSync(folder + `/${address}.json`, "utf-8");
};

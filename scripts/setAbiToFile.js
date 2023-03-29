import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = __dirname + "/voting_contracts";

export const setAbiToFile = async (address, abi) => {
  abi = JSON.stringify(abi);
  fs.writeFileSync(folder + `/${address}.json`, abi, "utf-8");
  return address;
};

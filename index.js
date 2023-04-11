import express, { json } from "express";
import cors from "cors";
import { getVotingList } from "./src/getVotingList.js";
import path from "path";
import { fileURLToPath } from "url";
import { setAbiToFile } from "./src/setAbiToFile.js";
import { getAbi } from "./src/getAbi.js";
import { createVotingEthers } from "./src/createVotingEthers.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const jsonParser = express.json();
const port = 8000;

app.use(express.static(__dirname));
app.use(cors());
app.use(json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/get-voting-list", async (req, res) => {
  try {
    const response = await getVotingList();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`{"Error": ${err}}`);
  }
});

app.get("/get-abi/:address", jsonParser, async (req, res) => {
  try {
    const response = await getAbi(req.params.address);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`{"Error": ${err}}`);
  }
});

app.get("/create-contract", async (req, res) => {
  try {
    const name = "Выборы в студсовет";
    const startDateTime = 1681143864;
    const endDateTime = 1682007864;
    const voters = [
      "0x543EbD3F56B2b9848b246C689E0302dC06CcFa48",
      "0x6FB9ad4e193D184A9C556cB3b782266dFc7664eb",
      "0x9284219535f1096E383876FE439882854b10891A",
    ];
    const proposalsAddress = [
      "0x4ab39574A9680B35142958A76F549318929C522f",
      "0x6Fae11C42fc7c6d6c6E4f4612E186435cA12b6Da",
      "0x1b7aa57c6fB213F1b2770017a136bF73176eB169",
    ];
    const proposalsNames = ["Кандидат 1", "Кандидат 2", "Кандидат 3"];

    const response = await createVotingEthers(
      name,
      startDateTime,
      endDateTime,
      voters,
      proposalsAddress,
      proposalsNames
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`{"Error": ${err}}`);
  }
});

app.post("/set-abi-to-file", jsonParser, async (req, res) => {
  try {
    const response = await setAbiToFile(
      req.body.address,
      JSON.parse(req.body.abi)
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`{"Error": ${err}}`);
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

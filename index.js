import express, { json } from "express";
import cors from "cors";
import { getVotingList } from "./scripts/getVotingList.js";
import path from "path";
import { fileURLToPath } from "url";
import { setAbiToFile } from "./scripts/setAbiToFile.js";

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

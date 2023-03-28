import express, { json } from "express";
import cors from "cors";
import { getVoting } from "./methods/getVoting.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
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

app.get("/get-voting", (req, res) => {
  try {
    const response = getVoting(req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`{"Error": ${err}}`);
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

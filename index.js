import express, { json } from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

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

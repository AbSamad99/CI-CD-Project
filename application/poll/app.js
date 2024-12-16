const express = require("express");
const app = express();
require("dotenv").config();

const { pool, createTables } = require("./db/db");

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  if (!(await createTables())) {
    console.log("Error connecting to database!! Exiting process.");
    process.exit(1);
  }
  console.log(`Example app listening on port ${port}`);
});

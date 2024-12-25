const express = require("express");
const app = express();
require("dotenv").config();

const { createTables } = require("./db/db");
const pollRoute = require("./route/poll");

const port = process.env.PORT;

app.use("/poll", pollRoute);

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

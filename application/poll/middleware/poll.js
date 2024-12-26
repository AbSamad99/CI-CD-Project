const { pool } = require("../db/db");

const getUser = async (req, res, next) => {
  const { email } = req.jwtContent;
  const client = req.pgClient;
  try {
    const userResult = await client.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );
    if (!userResult.rowCount)
      return res.status(404).json({ message: "User not found." });
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

const getPoll = async (req, res, next) => {
  const { id: pollId } = req.params;
  const client = req.pgClient;
  try {
    const client = await pool.connect();
    const pollResult = await client.query("SELECT * FROM polls WHERE id = $1", [
      pollId,
    ]);
    if (!pollResult.rowCount)
      return res.status(404).json({ message: "Poll not found." });
    req.poll = pollResult.rows[0];
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

const checkPollClosed = async (req, res, next) => {
  try {
    const poll = req.poll;
    if (Date.now() > poll.time_limit.getTime()) {
      return res.status(401).json({ message: "Poll is closed." });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

module.exports = { getUser, getPoll, checkPollClosed };

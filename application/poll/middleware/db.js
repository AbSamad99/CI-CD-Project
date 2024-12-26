const { pool } = require("../db/db");

const createPgClient = async (req, res, next) => {
  try {
    req.pgClient = await pool.connect();
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

module.exports = { createPgClient };

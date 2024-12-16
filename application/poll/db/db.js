const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const createTables = async () => {
  const client = await pool.connect();

  try {
    // Create Polls Table
    await client.query(`
        CREATE TABLE IF NOT EXISTS polls (
            id SERIAL PRIMARY KEY,
            creator_id INTEGER REFERENCES users(id),
            title VARCHAR NOT NULL,
            time_limit TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Create Poll Options Table
    await client.query(`
        CREATE TABLE IF NOT EXISTS poll_options (
            id SERIAL PRIMARY KEY,
            poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
            option_text VARCHAR NOT NULL,
            votes INTEGER DEFAULT 0
        );
    `);

    // Create Votes Table
    await client.query(`
        CREATE TABLE IF NOT EXISTS votes (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
            option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
            voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Tables setup successfully.");
  } catch (error) {
    console.error("Error setting up tables:", error);
    return false;
  } finally {
    client.release();
    return true;
  }
};

module.exports = { pool, createTables };

const { Router } = require("express");

const { verifyAndValidateToken } = require("../middleware/auth");
const { pool } = require("../db/db");

const pollRoute = Router();

pollRoute.use(verifyAndValidateToken);

// Create Poll
pollRoute.post("/create-poll", async (req, res) => {
  const { title, pollOptions } = req.body;
  const { email } = req.jwtContent;

  try {
    const client = await pool.connect();

    // Get the user ID from the email
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].id;

    // Insert into polls table
    const pollResult = await client.query(
      "INSERT INTO polls (creator_id, title, time_limit) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '7 days') RETURNING id",
      [userId, title]
    );
    const pollId = pollResult.rows[0].id;

    // Insert into poll_options table
    const pollOptionPromises = pollOptions.map((option) =>
      client.query(
        "INSERT INTO poll_options (poll_id, option_text) VALUES ($1, $2)",
        [pollId, option.option_text]
      )
    );
    await Promise.all(pollOptionPromises);

    client.release();

    res.status(201).json({ message: "Poll created successfully.", pollId });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Error creating poll." });
  }
});

// Delete Poll
pollRoute.delete("/delete-poll/:id", async (req, res) => {
  const { id: pollId } = req.params;
  const { email } = req.jwtContent;

  try {
    const client = await pool.connect();

    // Get the user ID and poll creator ID
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].id;

    const pollResult = await client.query(
      "SELECT creator_id FROM polls WHERE id = $1",
      [pollId]
    );
    if (!pollResult.rowCount) {
      return res.status(404).json({ message: "Poll not found." });
    }
    const creatorId = pollResult.rows[0].creator_id;

    // Verify the user is the creator of the poll
    if (userId !== creatorId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this poll." });
    }

    // Delete the poll
    await client.query("DELETE FROM polls WHERE id = $1", [pollId]);

    client.release();

    res.status(200).json({ message: "Poll deleted successfully." });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ message: "Error deleting poll." });
  }
});

// Vote on Poll
pollRoute.post("/vote/:id", async (req, res) => {
  const { id: pollId } = req.params;
  const { optionId } = req.body;
  const { email } = req.jwtContent;

  try {
    const client = await pool.connect();

    // Get the user ID
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].id;

    // Check if poll is closed
    const closedResult = await client.query(
      "SELECT * FROM polls WHERE id = $1",
      [pollId]
    );
    if (!closedResult.rowCount) {
      return res.status(404).json({ message: "Poll does not exist." });
    }
    const closed = closedResult.rows[0];
    if (Date.now() > closed.time_limit.getTime()) {
      return res.status(401).json({ message: "Poll is closed." });
    }

    // Check if the user has already voted
    const voteResult = await client.query(
      "SELECT * FROM votes WHERE user_id = $1 AND poll_id = $2",
      [userId, pollId]
    );
    if (voteResult.rowCount > 0) {
      return res.status(400).json({ message: "Vote already present." });
    }

    // Add vote to votes table
    await client.query(
      "INSERT INTO votes (user_id, poll_id, option_id) VALUES ($1, $2, $3)",
      [userId, pollId, optionId]
    );

    // Increment vote count in poll_options table
    await client.query(
      "UPDATE poll_options SET votes = votes + 1 WHERE id = $1",
      [optionId]
    );

    client.release();

    res.status(201).json({ message: "Vote cast successfully." });
  } catch (error) {
    console.error("Error voting on poll:", error);
    res.status(500).json({ message: "Error voting on poll." });
  }
});

// Update Vote on Poll
pollRoute.put("/update-vote/:id", async (req, res) => {
  const { id: pollId } = req.params;
  const { optionId } = req.body;
  const { email } = req.jwtContent;

  try {
    const client = await pool.connect();

    // Get the user ID
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].id;

    // Check if poll is closed
    const closedResult = await client.query(
      "SELECT * FROM polls WHERE id = $1",
      [pollId]
    );
    if (!closedResult.rowCount) {
      return res.status(404).json({ message: "Poll does not exist." });
    }
    const closed = closedResult.rows[0];
    if (Date.now() > closed.time_limit.getTime()) {
      return res.status(401).json({ message: "Poll is closed." });
    }

    // Check if the user has already voted
    const voteResult = await client.query(
      "SELECT * FROM votes WHERE user_id = $1 AND poll_id = $2",
      [userId, pollId]
    );
    if (!voteResult.rowCount) {
      return res.status(404).json({ message: "No vote to update." });
    }

    const currentOptionId = voteResult.rows[0].option_id;
    if (currentOptionId === optionId) {
      return res
        .status(400)
        .json({ message: "Vote already present for this option." });
    }

    // Update the vote
    await client.query(
      "UPDATE votes SET option_id = $1 WHERE user_id = $2 AND poll_id = $3",
      [optionId, userId, pollId]
    );

    client.release();

    res.status(200).json({ message: "Vote updated successfully." });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ message: "Error updating vote." });
  }
});

// Remove Vote on Poll
pollRoute.delete("/remove-vote/:id", async (req, res) => {
  const { id: pollId } = req.params;
  const { email } = req.jwtContent;

  try {
    const client = await pool.connect();

    // Get the user ID
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (!userResult.rowCount) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].id;

    // Check if the user has voted
    const voteResult = await client.query(
      "SELECT * FROM votes WHERE user_id = $1 AND poll_id = $2",
      [userId, pollId]
    );
    if (!voteResult.rowCount) {
      return res.status(404).json({ message: "No vote to remove." });
    }

    // Delete the vote
    await client.query(
      "DELETE FROM votes WHERE user_id = $1 AND poll_id = $2",
      [userId, pollId]
    );

    // Increment vote count in poll_options table
    await client.query(
      "UPDATE poll_options SET votes = votes - 1 WHERE id = $1",
      [optionId]
    );

    client.release();

    res.status(200).json({ message: "Vote removed successfully." });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).json({ message: "Error removing vote." });
  }
});

module.exports = pollRoute;

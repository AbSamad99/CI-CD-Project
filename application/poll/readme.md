# Poll Microservice

This microservice handles the creation, deletion, voting, and vote management for polls. It includes routes for poll management and ensures that all routes are protected with JWT-based authentication and authorization.

## Routes

### 1. Create Poll

- Endpoint: `POST /create-poll`
- Description: Creates a new poll and its corresponding poll options.
- Request Body:
  ```json
  {
    "poll": {
      "title": "Poll Title",
      "pollOptions": [
        { "option_text": "Option 1" },
        { "option_text": "Option 2" }
      ]
    }
  }
  ```
- Response:
  - `201 Created`: Poll created successfully.
  - `500 Internal Server Error`: Error creating the poll.

### 2. Delete Poll

- Endpoint: `DELETE /delete-poll/:id`
- Description: Deletes a poll if the requesting user is the creator of the poll.
- Path Parameters:
  - `id`: ID of the poll to delete.
- Response:
  - `200 OK`: Poll deleted successfully.
  - `403 Forbidden`: Unauthorized to delete the poll.
  - `404 Not Found`: Poll not found.
  - `500 Internal Server Error`: Error deleting the poll.

### 3. Vote on Poll

- Endpoint: `POST /vote/:id`
- Description: Allows a user to vote on a poll if they haven't already voted.
- Path Parameters:
  - `id`: ID of the poll.
- Request Body:
  ```json
  {
    "optionId": <poll_option_id>
  }
  ```
- Response:
  - `201 Created`: Vote cast successfully.
  - `400 Bad Request`: Vote already present.
  - `500 Internal Server Error`: Error casting the vote.

### 4. Update Vote on Poll

- Endpoint: `PUT /update-vote/:id`
- Description: Updates the user's vote on a poll.
- Path Parameters:
  - `id`: ID of the poll.
- Request Body:
  ```json
  {
    "optionId": <poll_option_id>
  }
  ```
- Response:
  - `200 OK`: Vote updated successfully.
  - `400 Bad Request`: Vote already present for this option.
  - `404 Not Found`: No vote to update.
  - `500 Internal Server Error`: Error updating the vote.

### 5. Remove Vote on Poll

- Endpoint: `DELETE /remove-vote/:id`
- Description: Removes the user's vote from a poll.
- Path Parameters:
  - `id`: ID of the poll.
- Response:
  - `200 OK`: Vote removed successfully.
  - `404 Not Found`: No vote to remove.
  - `500 Internal Server Error`: Error removing the vote.

## Authentication

- All routes are protected with the `verifyAndValidateToken` middleware.
- The JWT token must be included in the `Authorization` header as a Bearer token.

## Environment Variables

Ensure the following environment variables are set:

- `DB_HOST`: Hostname of the PostgreSQL database.
- `DB_PORT`: Port of the PostgreSQL database.
- `DB_NAME`: Name of the PostgreSQL database.
- `DB_USERNAME`: Username for the database.
- `DB_PASSWORD`: Password for the database.
- `JWT_PUBLIC_KEY`: Public key for verifying JWT tokens.

## Setup

- Build the application image using Docker:
  ```bash
  docker build -t poll-microservice .
  ```
- Run the image as a Docker container:
  ```bash
  docker run -p 3000:3000 --env-file .env poll-microservice
  ```

## Testing the Service

Use tools like `curl` or Postman to test the routes. Refer to the API Routes section for request and response details.

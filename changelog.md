## Changelog

### 16/12/24

- Switched the JWT signing algorithm to RS256 in the auth microservice, now only the public key needs to be shared with the rest of the microservices.

### 15/12/24

- Initialized the Node.js project for the poll microservice.
- Added logic to connect to the database and set up necessary tables.
- Added a GitHub Action to build the Docker container for the poll microservice and push it to Docker Hub.

### 13/12/24

- Added functionality to generate and validate JWT tokens and updated login logic.
- Resolved issues with the API.

### 12/12/24

- Added a workflow to automatically build and push the container for the auth microservice upon commit.
- Implemented all core logic for the auth service.

### 11/12/24

- Packaged the application as a Docker container image.
- Pushed the container image to my personal Docker repository.
- Integrated with PostgreSQL using Docker Compose.
- Persisted data using Docker volumes.

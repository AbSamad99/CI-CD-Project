## Changelog

### 31/12/24

- Adding composite action build-push-image to build and push docker images to repo.
- Using the new composite action in publish-auth and publish-poll.

### 30/12/24

- Adding reusable composite actions initialize-terraform and set-inventory-and-key to use across different workflows.
- Adding separate workflow to bring up docker compose on provisioned machine.
- Updating destroy workflow to use the terraform init composite action.

### 29/12/24

- Updating the changelog file.

### 28/12/24

- Tweaking install playbook to make sure git is installed and docker v2 with compose.
- Creating new playbook to clone the codebase and run the microservices using docker-compose.
- Updating GitHub deploy workflow to account for the changes to the playbook.

### 26/12/24

- Creating new middlewares to reduce code repetition in route handlers for the poll microservice.
- Tweaking vote logic to increment vote count in the `poll_options` table and adding checks to see if the poll is closed or not.

### 25/12/24

- Adding route handler and middlewares in the poll microservice.
- Adding printstack statements to debug errors and including user ID in JWTs in the auth microservice.

### 18/12/24

- Adding changelog and updating README with microservice information.

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

### 10/12/24

- Added the initial setup for the authentication microservice.
- Added a workflow to bring down the infrastructure.

### 03/12/24

- Updated the README file with the project overview.
- Deleted `temp.yml`, added `ansible.cfg`, and updated the `deploy.yml` workflow to fully integrate the Ansible logic. First milestone achieved!

### 02/12/24

- Added playbooks to configure the provisioned machine.
- Added the GitHub Actions workflow to deploy the infrastructure.
- Modified the Terraform configuration to make use of variables.

### 29/11/24

- Initial commit: Added the Terraform files for the backend and infrastructure.

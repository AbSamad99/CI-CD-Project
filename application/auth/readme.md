# Auth Microservice

This microservice provides user authentication and authorization functionalities, including JWT token generation and validation, user registration, login, and password reset.

## API Routes

### 1. Signup

- Endpoint: `POST /auth/signup`
- Description: Registers a new user by providing an email and password.
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```
  User registered successfully
  ```

### 2. Login

- Endpoint: `POST /auth/login`
- Description: Authenticates a user and provides a JWT token upon successful login.
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```
  JWT token
  ```

### 3. Generate Password Reset Token

- Endpoint: `POST /auth/password-reset-token`
- Description: Generates a password reset token for the user.
- Request Body:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- Response:
  ```
  Password reset token generated: <token>
  ```

### 4. Validate Password Reset Token

- Endpoint: `GET /auth/validate-token`
- Description: Validates if a password reset token is valid or expired.
- Query Parameters:
  - `token` (String): The reset token to validate.
- Response:
  ```
  Token is valid
  ```
  OR
  ```
  Token is invalid or expired
  ```

### 5. Reset Password

- Endpoint: `POST /auth/reset-password`
- Description: Resets the user's password using a valid token.
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "token": "<token>",
    "newPassword": "newpassword123"
  }
  ```
- Response:
  ```
  Password reset successfully
  ```

## Key Features

- User Authentication: Secure login and signup functionality.
- JWT Support: Token-based authentication for stateless APIs.
- Password Reset: Includes token generation and validation.
- Security: Uses RSA (RS256) for JWT signing and verification.

## Configuration

Ensure the environment where the application is running has the following variables defined:

```properties
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_PRIVATE_KEY=MIIBVgIBADANBgkqhkiG9w...
JWT_PUBLIC_KEY=MFwwDQYJKoZIhvcNAQEBBQ...
JWT_EXPIRATION=3600000
```

The application will reference these environment variables dynamically when running.

## Running the Service

- Build the application image using Docker:
  ```bash
  docker build -t auth-microservice .
  ```
- Run the image as a Docker container:
  ```bash
  docker run -p 8080:8080 --env-file .env auth-microservice
  ```

## Testing the Service

Use tools like `curl` or Postman to test the routes. Refer to the API Routes section for request and response details.

## Notes

- Ensure secure storage of the private and public keys.
- Rotate keys periodically to enhance security.

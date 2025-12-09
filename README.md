# Backend Test Project

## Requirements

*   **Node.js**: v20 or higher
*   **Docker**: For containerized deployment

## Running with Docker

1.  Make sure Docker and Docker Compose are installed.
2.  Run the application:
    ```bash
    docker-compose up --build
    ```
    This will start the backend service (on port 3000) and the PostgreSQL database.

## API Documentation

### Authentication

*   **POST** `/auth/register`
    *   Body: `{ "username": "yourusername", "password": "yourpassword" }`
    *   Description: Register a new user.

*   **POST** `/auth/login`
    *   Body: `{ "username": "yourusername", "password": "yourpassword" }`
    *   Description: Login to receive a JWT access token.

### Scores & Leaderboard

*   **POST** `/scores`
    *   **Protected**: Requires Bearer Token.
    *   Headers: `Authorization: Bearer <your_jwt_token>`
    *   Body: `{ "score": 100 }` (Users submit for themselves)
    *   Body (Admin only): `{ "score": 100, "name": "otheruser" }`
    *   Description: Submit a high score.

*   **GET** `/leaderboard`
    *   Description: Retrieve the top 10 high scores globally.

### General

*   **GET** `/`
    *   Description: Health check / Hello World.

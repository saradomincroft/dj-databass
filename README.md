# DJ Databass

## Overview

This project is a web application for managing a DJ database, including user authentication and account management. It utilizes Flask for the backend and will eventually incorporate a React frontend. The application supports user signup, login, and account management, with admin privileges for managing other users.

## Features

- **User Signup**: Allows users to create a new account.
- **User Login**: Authenticates users and starts a session.
- **User Logout**: Ends the user session.
- **Account Management**: Users can view and delete their own accounts.
- **Admin Privileges**: Admin users can view any account and delete any user accounts that aren't also admins.

## Technologies

- **Flask**: Web framework for the backend.
- **SQLAlchemy**: ORM for database interactions.
- **Flask-RESTful**: Extension for building REST APIs.
- **SQLite**: Database used for storing user information.
- **Flask-Migrate**: Handles database migrations.

## Setup

1. **Install Dependencies**:
   - Ensure you have Python and pip installed.
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```

2. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory of the project.
   - Add your configuration settings (e.g., database URI).

3. **Initialize the Database**:
   - Run the Flask shell and initialize the database:
     ```bash
     flask db init
     flask db migrate
     flask db upgrade
     ```

4. **Run the Application**:
   - Start the Flask development server:
     ```bash
     python app.py
     ```
   - Access the application at `http://localhost:4000`.

## API Endpoints

- **POST /signup**: Create a new user account.
  - Request body: `{ "username": "<username>", "password": "<password>", "is_admin": <true/false> }`
- **POST /login**: Log in and start a session.
  - Request body: `{ "username": "<username>", "password": "<password>" }`
- **DELETE /logout**: End the current user session.
- **GET /me**: Get details of the current user.
- **GET /users**: Get a list of all users (admin access required).
- **DELETE /users/<identifier>**: Delete a user by ID or username (users can delete own account, admin access required to delete other non-admin users).

## Application Structure

- `app.py`: Entry point for the application.
- `server/config.py`: Configuration settings.
- `server/models/user.py`: SQLAlchemy models for user management.
- `server/resources/user_resource.py`: API resources for user operations.
- `server/blueprints/user_blueprint.py`: Blueprint for user-related routes.
- `server/routes.py`: Defines and registers application routes and blueprints.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

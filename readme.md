# User Interaction Web Application

## Objective

This web application aims to provide a rich set of features for user interaction and administration, including user authentication, a friend system, and customizable themes.

## Technologies

- **Frontend:** ReactJS (with Redux or Context API for state management)
- **Backend:** NodeJS (Express)
- **Database:** MongoDB (or your preferred database, e.g., PostgreSQL, MySQL)

## Features

### Frontend

- **Login Page:** Authenticate users against the backend and display error messages for incorrect credentials.
- **Registration Page:** Register new users with password confirmation.
- **Dashboard Page:** Display a welcome message, last login time, an activity feed, and a list of friends.
- **Profile Page:** View and update profile details, including uploading a profile picture.
- **Notifications:** Show notifications for specific events.
- **Theme System:** Allow users to choose themes and implement a dark mode toggle.

### Backend

- **User Management Routes:** Implement routes for user registration, login, profile management, and more.
- **Authentication Middleware:** Middleware for securing routes and managing user sessions.
- **Data Management:** Store user information, friend lists, chat messages, and activity logs in the database.
- **API Rate Limiting:** Protect against abuse by limiting the number of requests to the API.

### Database

- Store user details, encrypted passwords, last login time, profile images, activity logs, friend lists, and chat messages.

### Extended Features

- **Friend System:** Send and receive friend requests, and search for other users.

## Setup & Configuration

### 1. Initial Setup

For Backend

cd wexa_assignment_backend
npm install
npm run start

For Frontend
cd wexa_assignment_frontend
npm install
npm run start

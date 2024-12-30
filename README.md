# Task Management Application

## Overview

The Task Management Application is a robust, feature-rich backend solution designed to manage tasks, users, and comments efficiently. It includes modern features like JWT-based authentication, data validation, rate limiting, deduplication, and worker-thread processing for scalability.

---

## Features

###### Core Functionality ########
#### User Management
- Register Users: Create new user accounts with validation.
- Login Authentication: Secure login with JSON Web Tokens (JWT).
- Admin Access: Fetch all users with role-based access (admin-only).
- Pagination Support: Retrieve users with paginated responses.

#### Task Management
- CRUD Operations: Create, Read, Update, and Delete tasks.
- Task Assignment: Assign tasks to specific users.
- Priority Levels: Set priority as Low, Medium, or High.
- Status Tracking: Update task statuses (Pending, In Progress, Completed).
- Filtering and Pagination: Fetch tasks based on priority or status with pagination.

#### Comment Management
- Add Comments: Attach comments to specific tasks.
- User and Task Linkage: Associate comments with tasks and users.

### Advanced Features

#### Authentication
- Secure login and access management with JWT tokens.
- Role-based authorization (admin, user).

#### Data Validation
- Middleware to validate incoming request payloads.

#### Error Handling
- Middleware for handling application errors and providing meaningful responses.

#### Rate Limiting
- Prevent abuse by limiting request rates per client.

#### Deduplication
- Ensure unique processing of tasks or requests.

---

## Architecture

### Tech Stack
- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Rate Limiting:** `express-rate-limit`
- **Environment Configuration:** `dotenv`

### Folder Structure

TASK_MANAGEMENT_BACKEND/
├── config/               # Configuration files for database connection
├── controllers/          # Request handlers for users, tasks, and comments
│   ├── commentController.js
│   ├── taskController.js
│   └── userController.js
├── logs/                 # Application logs
├── middlewares/          # Custom middlewares
│   ├── authMiddleware.js     # JWT-based authentication middleware
│   ├── authorize.js          # Role-based access control
│   ├── deduplicator.js       # Deduplication middleware
│   ├── errorHandler.js       # Centralized error handler
│   ├── rateLimiter.js        # Rate limiting middleware
│   ├── validateComment.js    # Validation for comment requests
│   ├── validateTask.js       # Validation for task requests
│   └── validateUser.js       # Validation for user requests
├── models/              # Mongoose schemas for MongoDB
│   ├── comment.js
│   ├── task.js
│   └── user.js
├── routes/              # Route handlers for APIs
│   ├── commentRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
├── utils/       
|     |__logger.js       # Utility functions (debug logger system)
├── .env                 # Environment variables
├── .gitignore           # Ignored files for Git
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lock file
└── README.md            # Project documentation 


### Installation 

# Prerequisites 
Node.js 
MongoDB 

# Steps 
 # Clone the repository: 
  - git clone https://github.com/NanduPastham123/task_management_app 
   
### Install dependencies: 

- npm install 
  
### Configure environment variables in a .env file: 
- PORT=8000 (example)
- MONGO_URI=<your-mongodb-connection-string> 
- JWT_SECRET=<your-secret-key> 
- NODE_ENV = development
  

### Start the application: 
- npm start 

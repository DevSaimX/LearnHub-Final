# LearnHub | MERN Stack Learning Management System

### Full Stack Web Development with React & Node.js

**Developed by:** Saim Iftikhar  
**Course:** Hunarmand Punjab - Full Stack Web Development with React & Node.js  
**Batch:** 3  
**Project Type:** Final Project  
**Technology:** MERN Stack

**GitHub Repository:**  
https://github.com/DevSaimX/LearnHub-Final

---

## 1. Project Overview

LearnHub is a full-stack Learning Management System (LMS) developed using the MERN Stack: MongoDB, Express.js, React.js, and Node.js.

The application provides a platform where students can explore courses, enroll in available programs, access educational lessons, and monitor their learning progress.

Instructors can create and manage courses, publish lessons, and update their educational content.

Administrators can manage platform users, supervise courses, and view system analytics.

The project demonstrates practical implementation of frontend development, backend APIs, database integration, authentication, authorization, and CRUD operations.

### Project Objectives

The primary objectives of LearnHub are:

- Develop a functional full-stack MERN application.
- Implement frontend navigation using React Router.
- Connect React with Express REST APIs using Axios.
- Store and manage application data using MongoDB.
- Implement user authentication with JWT.
- Protect sensitive routes using role-based authorization.
- Provide different dashboards for Students, Instructors, and Admins.
- Implement student enrollment and learning progress tracking.
- Demonstrate CRUD operations using React, Node.js, and MongoDB.

---

## 2. Project Features

### General Features

- Responsive and modern user interface
- Home page with featured courses
- Searchable course catalog
- Course category filtering
- Individual course details
- User registration and login
- JWT-based authentication
- Protected dashboard routes
- Error handling and form validation
- MongoDB database integration

### Student Features

Students can:

- Create an account and log in
- Browse available courses
- Search and filter courses
- View course information
- Enroll in courses
- Access enrolled course lessons
- Mark lessons as completed
- Track course completion percentages
- View enrolled courses on their dashboard

### Instructor Features

Instructors can:

- Register and log in
- Access the Instructor Dashboard
- Create new courses
- Edit existing courses
- Delete their own courses
- Add text-based lessons
- Update lesson content
- Delete lessons
- Manage their published courses

### Admin Features

Administrators can:

- Access the Admin Dashboard
- View platform analytics
- View registered users
- Manage user accounts
- Update user information and roles
- Delete user accounts
- Manage courses across instructors
- Manage course lessons
- Monitor courses and enrollments

---

## 3. Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React.js | Building the user interface |
| Vite | Frontend development and build tool |
| JavaScript | Application functionality |
| React Router | Navigation and protected routes |
| Axios | API communication |
| Bootstrap | Responsive UI components |
| CSS | Custom application styling |
| Lucide React | Interface icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Frontend-backend communication |
| dotenv | Environment variable management |
| Nodemon | Development server restarts |

### Development and Testing Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB Atlas
- Thunder Client
- npm
- Browser Developer Tools

---

## 4. Assignment Requirements

This project was developed as the final assignment for the Full Stack Web Development with React & Node.js course.

### Question 1: MERN Stack Learning Management System

**Marks: 20**

Implemented functionality includes:

- React frontend development
- Home page
- Course Listing page
- Course Detail page
- Login page
- Registration page
- React Router navigation
- Reusable React components
- React Hooks: useState and useEffect
- Conditional rendering
- Dynamic list rendering
- Axios API integration
- Express backend
- MongoDB database connection
- Mongoose models
- Course CRUD operations
- User authentication APIs
- Responsive application styling

### Question 2: Authentication, Role-Based Access and Deployment Extension

**Marks: 20**

Implemented functionality includes:

- JWT authentication
- bcryptjs password hashing
- Environment variables
- Role-based authorization
- Student Dashboard
- Instructor Dashboard
- Admin Dashboard
- Protected frontend and backend routes
- Student course enrollment
- Enrollment database model
- Lesson completion functionality
- Learning progress tracking
- API error handling
- API testing
- Production build preparation

**Total Marks: 40**

---

## 5. Project Structure

The project is divided into two main folders:

- `frontend`: React application
- `backend`: Node.js and Express application

```text
LearnHub-Final/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Account.jsx
│   │   ├── App.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── Catalog.jsx
│   │   ├── Dashboards.jsx
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── components.jsx
│   │   ├── format.js
│   │   ├── main.jsx
│   │   ├── useResource.js
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   └── validation.js
│   │
│   ├── middleware/
│   │   └── http.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Enrollment.js
│   │
│   ├── routes/
│   │   └── api.js
│   │
│   ├── scripts/
│   │   ├── create-admin.js
│   │   └── verify-api.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── docs/
│   ├── API-TESTING.md
│   └── REPORT-OUTLINE.md
│
├── .gitignore
└── README.md
```

---

## 6. Prerequisites

Before running the project, make sure the following software and services are available:

1. Node.js 24 LTS
2. npm
3. Visual Studio Code or another code editor
4. MongoDB Atlas account
5. Git
6. Modern web browser

### MongoDB Requirements

You need:

- A MongoDB Atlas cluster
- A database user with read/write permissions
- A database connection string
- Network access configured for your current IP
- A database named `learnhub_db`

**Important:** Some database operations use MongoDB transactions. Use MongoDB Atlas or a local MongoDB replica set.

---

## 7. Installation and Setup

Follow these steps to run LearnHub locally.

### Step 1: Clone the Repository

Open PowerShell or the VS Code terminal.

```powershell
git clone https://github.com/DevSaimX/LearnHub-Final.git
```

Move into the project folder:

```powershell
cd LearnHub-Final
```

### Step 2: Configure Backend Environment

Copy the backend environment example:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend/.env` and configure:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_HOST/learnhub_db
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173
```

Replace the MongoDB placeholders with your own Atlas connection details.

Use a long, randomly generated value for `JWT_SECRET`.

**Security Notice:** Never upload your actual `.env` file, database password, or JWT secret to GitHub.

### Step 3: Install Backend Dependencies

Open the first terminal:

```powershell
cd backend
```

Install dependencies:

```powershell
npm ci
```

Start the backend:

```powershell
npm start
```

For automatic restarts during development:

```powershell
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

Check the API health endpoint:

http://localhost:5000/api/health

A successful response should indicate that the API is running and MongoDB is connected.

### Step 4: Install Frontend Dependencies

Open a second terminal from the project root:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm ci
```

Start the React application:

```powershell
npm run dev
```

Open:

http://localhost:5173/

You should now see the LearnHub application.

### Optional: Frontend Environment

The default frontend API URL is:

```text
http://localhost:5000/api
```

If you need a different API URL, copy:

```powershell
Copy-Item .env.example .env
```

Inside the `frontend` folder, configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the frontend development server after changing this value.

Never place database credentials or JWT secrets in frontend environment variables.

---

## 8. User Roles and Authorization

LearnHub implements three authenticated user roles.

| Role | Permissions |
|------|-------------|
| Student | Browse courses, enroll, view lessons, track progress |
| Instructor | Create courses, manage owned courses and lessons |
| Admin | Manage users, courses, lessons, and view analytics |

Visitors can browse courses without creating an account.

### Authentication

The authentication system includes:

- Registration
- Login
- Password hashing with bcryptjs
- JWT token generation
- JWT verification
- Role-based access control
- Session restoration
- Protected frontend routes
- Protected backend endpoints

JWT sessions expire after eight hours.

Public registration supports Student and Instructor accounts.

Administrator accounts must be provisioned separately.

---

## 9. Creating an Admin Account

Admin accounts are created through the backend provisioning script.

Open PowerShell inside the `backend` directory.

Run:

```powershell
$learnHubAdminSecret = Read-Host 'New admin password' -AsSecureString

$env:ADMIN_PASSWORD = (New-Object System.Management.Automation.PSCredential('learnhub', $learnHubAdminSecret)).GetNetworkCredential().Password

try {
    npm run create-admin -- 'LearnHub Admin' 'admin@example.com'
} finally {
    Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Variable learnHubAdminSecret -ErrorAction SilentlyContinue
}
```

Replace `admin@example.com` with your preferred admin email.

The password must contain at least 12 characters.

After successful creation, log in through the normal Login page.

**Note:** The administrator role cannot be selected through public registration.

---

## 10. Database Models

LearnHub uses three main Mongoose models.

### User Model

Stores user account information.

Main fields:

- Name
- Email
- Hashed password
- Role
- Timestamps

Supported roles:

- Student
- Instructor
- Admin

### Course Model

Stores course information.

Main fields:

- Title
- Description
- Instructor reference
- Category
- Price
- Lessons
- Timestamps

Each lesson contains a title and text content.

### Enrollment Model

Stores student enrollment information.

Main fields:

- Student reference
- Course reference
- Completed lessons
- Progress percentage
- Timestamps

A unique database index prevents duplicate enrollment in the same course.

---

## 11. REST API Endpoints

The backend provides RESTful APIs through Express.js.

Base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a user |
| POST | `/login` | Authenticate a user |
| GET | `/me` | Retrieve authenticated user |

### Course APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Retrieve available courses |
| GET | `/courses/:id` | Retrieve course details |
| GET | `/managed-courses` | Retrieve instructor/admin managed courses |
| POST | `/courses` | Create a course |
| PUT | `/courses/:id` | Update a course |
| DELETE | `/courses/:id` | Delete a course |

### Lesson APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/courses/:id/lessons` | Add a lesson |
| PUT | `/courses/:id/lessons/:lessonId` | Update a lesson |
| DELETE | `/courses/:id/lessons/:lessonId` | Delete a lesson |

### Enrollment APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enroll` | Enroll in a course |
| GET | `/enroll/:id` | Check enrollment status |
| GET | `/my-courses` | Retrieve enrolled courses |
| PUT | `/my-courses/:id/lessons/:lessonId` | Update lesson completion |

### Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | Retrieve users |
| PUT | `/admin/users/:id` | Update a user |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/analytics` | Retrieve platform statistics |

### API Security

Protected API requests require a JWT.

Example authorization header:

```text
Authorization: Bearer <your_jwt_token>
```

API requests containing JSON use:

```text
Content-Type: application/json
```

Invalid requests return appropriate HTTP status codes and error messages.

For detailed API examples, see:

[API Testing Guide](docs/API-TESTING.md)

---

## 12. React Concepts Implemented

The application demonstrates the React concepts covered during the course.

### Functional Components

React functional components are used to create reusable interface sections.

### useState

The `useState` Hook manages application data and component state.

Examples include:

- Form inputs
- User interface state
- Course-related state
- Loading and error states

### useEffect

The `useEffect` Hook handles side effects, including API data fetching.

### Props

Props are used to transfer information between components.

### React Router

React Router handles navigation between pages and dashboards.

### Conditional Rendering

The interface displays content according to user authentication, loading status, and role.

### Dynamic Rendering

Course lists and dashboard information are rendered dynamically from backend data.

### Axios

Axios connects the React frontend with the Express backend.

---

## 13. CRUD Operations

CRUD stands for:

- Create
- Read
- Update
- Delete

LearnHub implements CRUD operations for courses and related data.

| Operation | Example |
|-----------|---------|
| Create | Instructor creates a course |
| Read | Student views available courses |
| Update | Instructor edits course information |
| Delete | Instructor removes a course |

The application communicates with Express APIs, which interact with MongoDB using Mongoose.

---

## 14. Enrollment and Progress Tracking

LearnHub provides an enrollment system for students.

### Enrollment Flow

1. Student registers or logs in.
2. Student browses available courses.
3. Student selects a course.
4. Student enrolls in the course.
5. Enrollment information is stored in MongoDB.
6. The course appears on the Student Dashboard.
7. Student opens available lessons.
8. Student marks lessons as completed.
9. Progress percentage is updated.

### Progress Calculation

Progress is calculated using the number of completed lessons relative to the total available lessons.

For example:

```text
Total Lessons: 2
Completed Lessons: 1

Progress: 50%
```

Duplicate enrollment is prevented.

The current implementation provides immediate lesson access after enrollment.

Course prices are displayed in USD, but an online payment gateway is not integrated.

---

## 15. Testing

The application includes testing and verification for its major features.

### Frontend Testing

The following workflows can be tested:

- Home page loading
- Course catalog
- Course details
- Login and registration
- Course creation
- Course editing
- Student enrollment
- Lesson completion
- Admin dashboard
- Protected route behavior

### Backend API Testing

Thunder Client can be used to test API endpoints.

Important test cases include:

- GET courses
- POST register
- POST login
- POST create course
- PUT update course
- DELETE course
- POST enroll
- GET my-courses
- Unauthorized access
- Duplicate enrollment prevention

### Automated Backend Verification

From the `backend` directory:

```powershell
npm test
```

The verification script tests major API flows using a randomly named temporary MongoDB database.

It removes the temporary verification database after testing.

**Important:** Use database credentials that permit creating and dropping a temporary database.

### Frontend Code Quality

From the `frontend` directory:

Run ESLint:

```powershell
npm run lint
```

Generate a production build:

```powershell
npm run build
```

The production build output is generated in:

```text
frontend/dist/
```

---

## 16. Testing Evidence and Documentation

The project was tested using:

- Local React application
- Node.js/Express server
- MongoDB Atlas
- Thunder Client
- Browser testing

The final project PDF report submitted with the assignment contains evidence of:

1. Project structure
2. Home page
3. Course listing
4. Course details
5. User registration
6. Instructor course creation
7. Course management
8. API responses
9. MongoDB database records
10. Admin dashboard
11. Protected route behavior
12. Student enrollment
13. Lesson access
14. Progress tracking
15. Duplicate enrollment prevention
16. Important source code
17. Application testing

Additional instructions are available in:

- [API Testing Guide](docs/API-TESTING.md)
- [Report Outline](docs/REPORT-OUTLINE.md)

---

## 17. Deployment Status

### Current Status

**Development completed and tested locally.**

The application has been developed using the MERN Stack, and its primary functionality has been tested through the frontend, backend, MongoDB Atlas, and API testing tools.

The source code is available publicly on GitHub.

### Future Deployment

Live deployment is planned for a future update.

Due to current university responsibilities and final-year project commitments, I have prioritized completing the application, verifying its functionality, documenting its implementation, and submitting the required evidence.

The planned next steps include:

- Deploying the React frontend
- Hosting the Node.js/Express backend
- Configuring production environment variables
- Connecting the deployed backend to MongoDB Atlas
- Testing the publicly hosted application
- Sharing the completed live project on LinkedIn

**Live Application URL:** Not available yet.

This repository currently represents the locally tested application and its deployment-ready source code.

---

## 18. Security Considerations

LearnHub includes the following security measures:

- Hashed passwords using bcryptjs
- JWT-based authentication
- Role-based authorization
- Backend route protection
- Course ownership checks
- Input validation
- Controlled environment variables
- Duplicate enrollment prevention
- Error handling

Sensitive files such as `.env` should never be committed to GitHub.

The repository includes `.env.example` files to help developers configure their own environments without exposing credentials.

---

## 19. Future Improvements

Potential future enhancements include:

- Public deployment
- Course images and thumbnails
- Video-based lessons
- File uploads
- Online payment integration
- Course reviews and ratings
- Email verification
- Password reset functionality
- Improved analytics and reports
- Student completion certificates

These features are planned enhancements and are not part of the current implementation.

---

## 20. Author

### Saim Iftikhar

**AI/ML Engineer | Full Stack Developer**

Developed as part of the Hunarmand Punjab Full Stack Web Development with React & Node.js course.

**GitHub:**  
https://github.com/DevSaimX

**Project Repository:**  
https://github.com/DevSaimX/LearnHub-Final

---

## 21. Acknowledgment

This project was developed as part of the Full Stack Web Development with React & Node.js training program under Hunarmand Punjab.

The project provided practical experience in:

- React frontend development
- JavaScript programming
- REST API development
- Express.js and Node.js
- MongoDB database management
- Authentication and authorization
- Full-stack application integration
- Debugging and testing
- Git and GitHub

---

## Conclusion

LearnHub demonstrates the development of a functional MERN Stack Learning Management System with user authentication, role-based access control, course management, student enrollment, and progress tracking.

The application combines React, Node.js, Express, and MongoDB to implement the core concepts covered during the course.

The current version has been developed and tested locally, with public deployment planned as a future improvement.

**Developed by Saim Iftikhar.**

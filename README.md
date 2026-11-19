# LearnHub

LearnHub is a MERN learning management system. Students enroll and work through text lessons, instructors publish and maintain courses, and administrators manage accounts and review platform activity.

## Technology

- React, React Router, Vite, Axios, Bootstrap, custom CSS, and Lucide React
- Node.js, Express, MongoDB Atlas, and Mongoose
- JWT authentication and bcryptjs password hashing

## Run locally

Use Node.js 24 LTS and npm. You also need a MongoDB Atlas database user with read/write access to `learnhub_db` and an Atlas network access rule for your current IP address. Course and account deletion use MongoDB transactions, so use Atlas or a local replica set.

1. If `backend/.env` already exists, use it. Otherwise copy `backend/.env.example` to `backend/.env` and set the connection string and JWT secret. Include `/learnhub_db` in the database connection string.
2. In one terminal, run:

   ```powershell
   cd backend
   npm ci
   npm start
   ```

3. In another terminal, run:

   ```powershell
   cd frontend
   npm ci
   npm run dev
   ```

4. Open [LearnHub locally](http://localhost:5173/). Check the backend at [API health](http://localhost:5000/api/health). Register an instructor and create a course to populate the catalog and featured section.

The backend also supports `npm run dev` for automatic restarts.

| Variable | Location | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Backend | MongoDB Atlas URI with target database |
| `JWT_SECRET` | Backend | Long, randomly generated signing secret |
| `PORT` | Backend | API port, defaults to `5000` |
| `CLIENT_ORIGIN` | Backend | Optional comma-separated frontend origins |
| `VITE_API_URL` | Frontend | Optional API base URL, defaults to `http://localhost:5000/api` |

Copy `frontend/.env.example` to `frontend/.env` if you need a custom API URL. Vite exposes the frontend variable to the browser. Keep all credentials in the backend. Restart the relevant process after changing its environment.

## Roles

| Role | Capabilities |
| --- | --- |
| Visitor | Browse, search, and filter courses, and see lesson titles |
| Student | Enroll once per course, read its lessons, toggle lesson completion, and track progress |
| Instructor | Create courses and edit or delete their own courses and lessons |
| Admin | View analytics, manage courses and lessons across instructors, and list, edit, or delete accounts |

Prices display in USD. Enrollment grants access immediately for both free and priced courses. The featured section shows the three latest courses in MongoDB. Progress is the percentage of currently available lessons marked complete.

JWTs are valid for eight hours. The frontend restores the session via `GET /api/me` on refresh, and the API checks the account's current role on protected requests. Signing out clears the token from the browser.

### Provision an administrator

From `backend`, run this PowerShell block with an unused email address. The script reads the password from the temporary environment variable and requires at least 12 characters.

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

Sign in through the regular login form. Admin role assignments are reserved for local provisioning. An admin cannot delete their own account. Remove an instructor's courses before deleting the account or changing its role. An account with enrollments can be deleted, which removes those enrollments, or retain its student role.

## REST API

All routes are under `/api`. Protected requests use `Authorization: Bearer <token>`. Requests with a body use `Content-Type: application/json`. API errors return `{ "message": "..." }`.

| Method | Path | Access |
| --- | --- | --- |
| GET | `/health` | Public |
| POST | `/register`, `/login` | Public |
| GET | `/me` | Signed in |
| GET | `/courses`, `/courses/:id` | Public |
| GET | `/managed-courses` | Instructor or admin |
| POST | `/courses`, `/courses/:id/lessons` | Instructor or admin |
| PUT, DELETE | `/courses/:id`, `/courses/:id/lessons/:lessonId` | Course owner or admin |
| POST | `/enroll` | Student |
| GET | `/enroll/:id`, `/my-courses` | Student |
| PUT | `/my-courses/:id/lessons/:lessonId` | Enrolled student |
| GET | `/admin/users`, `/admin/analytics` | Admin |
| PUT, DELETE | `/admin/users/:id` | Admin |

See the [API testing guide](docs/API-TESTING.md) for sample requests, expected results, and runnable verification. See the [report outline and submission checklist](docs/REPORT-OUTLINE.md) for screenshot coverage.

## Project layout

```text
backend/
  app.js, server.js       Express setup and startup
  config/                Environment and database connection
  controllers/           Authentication, courses, enrollments, admin
  middleware/            Authentication, role guards, ID and error handling
  models/                User, Course, Enrollment schemas and indexes
  routes/                API route definitions
  scripts/               Admin provisioning and API verification
frontend/
  src/                   Pages, components, Axios, auth state, CSS
  index.html             Vite entry point
docs/                    Testing guide and submission checklist
```

Build and lint from `frontend` with `npm run lint` and `npm run build`. Run `npm test` from `backend` with credentials that can create and drop a temporary database. Keep `.env`, `node_modules/`, and `dist/` out of source control, and include both lockfiles and `.env.example` files.

# LearnHub report outline and submission checklist

Use the question labels below as a suggested split if your assignment sheet gives different wording. Capture your own run with disposable accounts. Keep passwords, tokens, connection strings, and private Atlas details out of every screenshot.

## Question 1 · Frontend and user experience

1. **Home and catalog** — the landing page with real featured courses, followed by a filtered catalog with the search term and category visible.
2. **Course details** — title, instructor, price, lesson outline, and enrollment action.
3. **Accounts and navigation** — registration form showing the student and instructor choices, login form, and signed-in navigation.
4. **Student dashboard** — an enrolled course, one expanded lesson, and a completion result with progress visible.
5. **Instructor dashboard** — course management and the lesson editor. Show the course in the public catalog after creation.
6. **Admin dashboard** — analytics cards, user management, and course management.
7. **Responsive and route states** — narrow-screen navigation and at least one unauthorized or not-found page.

Describe the components involved and how they fetch data, update the UI, and show loading or validation feedback.

## Question 2 · Backend, database, and integration

1. **Database evidence** — the `learnhub_db` collections for users, courses, and enrollments in Atlas. Use sanitized views and crop sensitive fields.
2. **Authentication** — registration and login status codes, plus an authenticated `GET /api/me` response with the role visible. Hide bearer tokens and passwords.
3. **Course and lesson APIs** — instructor creation, public listing, owner update, and deletion responses.
4. **Enrollment and progress** — successful enrollment, `GET /api/my-courses`, a progress update, and the duplicate enrollment 409.
5. **Authorization and validation** — a student or non-owner instructor receiving 403 and an invalid ID or field receiving 400.
6. **Admin and health** — successful admin management or analytics, then the health endpoint showing the connected database.
7. **Verification** — terminal output for the API suite, frontend lint, and production build.

Explain the instructor and enrollment references, the unique email and enrollment indexes, JWT verification, and ownership checks.

## Before submitting

- [ ] Run the API verification, lint, and production build.
- [ ] Verify login, refresh persistence, role protection, and the dashboard flows in a browser.
- [ ] Capture the required screenshots, match them to the actual assignment questions, and add captions.
- [ ] Include the root README, API guide, report outline, example environment files, and lockfiles.
- [ ] Check the files staged for GitHub. Exclude credentials, dependencies, generated builds, and screenshots that expose sensitive values.

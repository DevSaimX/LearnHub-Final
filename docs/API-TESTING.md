# API testing guide

Start the API and use `http://localhost:5000/api` as the base URL in Postman, Insomnia, or curl. Set `Content-Type: application/json` on requests with a body. On protected routes set `Authorization: Bearer <token>`. Replace placeholder IDs with the actual `_id` values from responses. Use disposable accounts when testing deletion.

## Authentication and authorization

| Request | Example JSON | Expected result |
| --- | --- | --- |
| POST `/register` | `{"name":"Sara Student","email":"sara@example.test","password":"StudentPass123","role":"student"}` | 201 with `{token,user}` and student role |
| POST `/register` | `{"name":"Imran Instructor","email":"imran@example.test","password":"InstructorPass123","role":"instructor"}` | 201 with instructor role |
| POST `/login` | `{"email":"sara@example.test","password":"StudentPass123"}` | 200 with `{token,user}`. Repeat with the instructor credentials for an instructor token |
| GET `/me` | — | 200 with current account fields |
| POST `/register` | Repeat Sara's body or change the email's letter case | 409 with `{"message":"Email is already registered."}` |
| POST `/register` | Use a fresh email and `"role":"admin"` | 400 with a role validation message |
| GET `/me` | Omit the token or send an invalid token | 401 with a JSON message |

Verify that the account payloads have no password field.

## Courses, lessons, and progress

Create a course as the instructor with POST `/courses`:

```json
{
  "title": "React Foundations",
  "description": "Build interactive pages with components and state.",
  "category": "Development",
  "price": 0
}
```

| Request | Expected result |
| --- | --- |
| GET `/courses?q=react&category=Development` without a token | 200 array containing the course and instructor name |
| GET `/courses/:id` | 200 course details with lesson titles |
| PUT `/courses/:id` as the owner with the full course body and a new title | 200 with the revised course |
| PUT or DELETE `/courses/:id` as a second instructor | 403 |
| POST `/courses` as the student | 403 |
| POST `/courses` with a negative numeric price as the instructor | 400 with a price validation message |
| GET `/courses/bad-id` | 400 with `{"message":"Invalid ID."}` |
| POST `/courses/:id/lessons` as owner with `{"title":"Components","content":"Compose an interface from components."}` | 201 with the new lesson and its ID |
| PUT `/courses/:id/lessons/:lessonId` as owner with `{"title":"JSX","content":"Write markup inside components."}` | 200 with the revised lesson |
| POST `/enroll` as student with `{"courseId":"<course-id>"}` | 201 enrollment with `progress: 0` |
| POST `/enroll` with the same student and course | 409 with `{"message":"You are already enrolled in this course."}` |
| GET `/enroll/:id` as that student | 200 with `{"enrolled":true}` |
| GET `/my-courses` as the student | 200 array with the populated course, readable lessons, `progress`, and `completedLessons` |
| PUT `/my-courses/:id/lessons/:lessonId` as the student with `{"completed":true}` | 200 with updated progress, 100 for a one-lesson course. Send `false` to undo |
| DELETE `/courses/:id/lessons/:lessonId` as the owner | 200 with `{"message":"Lesson deleted."}` |
| DELETE `/courses/:id` as owner after enrollment | 200 with `{"message":"Course deleted."}`. The course then returns 404 and disappears from `/my-courses` |

The create course request returns 201 with the course and its `_id`. Test enrollment before deleting the course. The enrollment endpoint returns 403 for instructors and admins.

## Admin

Provision an admin using the local process in the [README](../README.md) and sign in for an admin token.

| Request | Expected result |
| --- | --- |
| GET `/admin/users` | 200 with an array of accounts |
| PUT `/admin/users/:id` with `{"name":"Updated Name","email":"updated@example.test","role":"student"}` | 200 with the updated eligible account |
| DELETE `/admin/users/:id` using a disposable account | 200 with `{"message":"User deleted."}`. That account's existing token receives 401 on its next authenticated request |
| GET `/admin/analytics` | 200 with `users`, `courses`, `enrollments`, and `roles` counts |
| PUT or DELETE `/courses/:id` for a course created by an instructor | 200 |
| GET `/admin/users` with a student or instructor token | 403 |

## Automated verification

- From `backend`, run `npm test`. The suite starts Express on an ephemeral local port using a randomly named temporary database on the configured MongoDB cluster. It exercises the API and provisioning script, checks concurrent duplicate enrollment rejection, and drops that temporary database on exit. The credentials need permission to create and drop the temporary database. Use separate test credentials if your runtime account is scoped to `learnhub_db`.
- From `frontend`, run `npm run lint` and `npm run build`.
- With the normal backend running, GET `/api/health` should return 200 and `"database":"connected"`. In a browser, verify the protected routes, form submission, sign-out, refresh persistence, responsive layout, and dashboard updates using the [report outline](REPORT-OUTLINE.md).

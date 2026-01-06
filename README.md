# Student Grades Management System

A simple system to manage student records and grades using Java backend with in-memory storage and a React UI.

## Features

- Add and remove students
- Track student grades
- Automatic GPA calculation
- View all students and their performance
- Clean, intuitive UI

## Project Structure

### Repository layout
- **frontend/** – Next.js 16 UI (all React, Tailwind, and ESLint config now live here)
- **backend/** – Spring Boot 3 API (Maven project containing Grade controllers/services)
- **lib/**, **app/**, etc. – shared assets or legacy files kept for reference

### Backend highlights
- **backend/src/main/java/com/gradapp/model/Student.java** – student entity with grade management
- **backend/src/main/java/com/gradapp/service/GradeManager.java** – in-memory storage and GPA logic
- **backend/src/main/java/com/gradapp/controller/GradeController.java** – REST endpoints
- **backend/src/main/java/com/gradapp/GradesApplication.java** – Spring Boot entry point

### Frontend highlights
- Next.js app lives entirely in `frontend/`
- Clean interface for adding/removing students & marks
- Student list with GPA summaries and subject-level details

## Requirements

Install the tooling below before attempting to build or run the project:

- Java 17 or newer (Temurin, Azul, or Oracle distributions all work)
- Maven 3.9+
- Node.js 18+ with npm 9+
- Git (optional but recommended for pulling updates)

> **Tip:** After cloning the repository, run `java -version`, `mvn -v`, and `node -v` inside the repo root to confirm each tool is on your `PATH`.

## Local Setup & Scripts

All commands assuming you are in the repository root.

### 1. Install dependencies

```bash
npm install
```

The root `postinstall` script installs every frontend dependency inside `frontend/` for you. If the frontend folder is moved or you prefer pnpm, adjust the script or run `npm install` directly from `frontend/`.

### 2. Start the Spring Boot backend

```bash
npm run backend:run
```

- Proxies to `cd backend && mvn spring-boot:run`
- Default REST base URL: http://localhost:8080/api
- Press `Ctrl+C` to stop the server when finished

To run unit tests only: `npm run backend:test` (or `cd backend && mvn test`).

### 3. Start the Next.js frontend

```bash
npm run dev
```

- Runs `next dev` inside `frontend/`
- App UI is served on http://localhost:3000 by default
- The frontend automatically targets `http://localhost:8080/api`. To point at another API host, set `NEXT_PUBLIC_API_BASE` before running the command, e.g.:

```bash
export NEXT_PUBLIC_API_BASE="https://my-api.example.com/api"
npm run dev
```

For production builds use `npm run build` followed by `npm run start` (which executes the corresponding Next.js scripts under `frontend/`).

### 4. Useful scripts reference

| Command | Description |
| --- | --- |
| `npm run backend:run` | Launch Spring Boot API with automatic recompilation |
| `npm run backend:test` | Execute Maven test suite |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run the frontend ESLint checks |

> **Need HTTPS in local dev?** Pair the backend with a tunnel (ngrok, Cloudflared) and update `NEXT_PUBLIC_API_BASE` accordingly.

## API Endpoints

- `POST /api/students` - Add new student
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get specific student
- `DELETE /api/students/{id}` - Delete student
- `POST /api/students/{id}/grades` - Add grade to student
- `DELETE /api/students/{id}/grades/{index}` - Remove grade from student
- `GET /api/students/sorted/gpa` - Get students sorted by GPA

## Technology Stack

- **Backend**: Java, Spring Boot
- **Frontend**: React, Next.js, Tailwind CSS
- **Storage**: In-Memory (HashMap)

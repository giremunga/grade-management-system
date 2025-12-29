# Student Grades Management System

A simple system to manage student records and grades using Java backend with in-memory storage and a React UI.

## Features

- Add and remove students
- Track student grades
- Automatic GPA calculation
- View all students and their performance
- Clean, intuitive UI

## Project Structure

### Backend (Java Spring Boot) src folder.
- **Student.java** - Student entity with grade management
- **GradeManager.java** - In-memory storage and business logic
- **GradeController.java** - REST API endpoints
- **GradesApplication.java** - Spring Boot application entry point

### Frontend (React/Next.js)
- Simple, clean interface for managing students and grades
- Real-time updates when adding/removing grades
- Student list with sorting by GPA

## Setup Instructions

### Backend
1. Install Java 11+ and Maven and jdk (java development kit )
1.install extensions ,extension pack for java and spring boot extension pack
2. Create a Spring Boot project with the files above
3. Add Maven dependency: spring-boot-starter-web
4. Run: `mvn spring-boot:run`
5. Server runs on http://localhost:8080

### Frontend
1. Node.js and npm installed
2. This project uses Next.js with the provided files
3. Run: `npm install && npm run dev`
4. Access on http://localhost:3000

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

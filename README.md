# 75 Way Project Task

## Full-Stack Home Tuition Management & Tutor Marketplace

A production-oriented full-stack web application designed to connect students and parents with tutors while providing administrators with tools for tutor verification, assignment, scheduling, and workflow management.

This project was developed **end-to-end as a freelance engagement**, covering the application architecture, frontend, backend, database integration, authentication, authorization, document handling, workflow automation, and deployment-ready implementation.

> **Privacy & Submission Note**
>
> This repository is a **privacy-preserving submission version** of a real-world client project. To respect client confidentiality, certain client-specific functionality, implementation details, and production configurations have been simplified, downgraded, or intentionally omitted from this public submission. The repository is therefore not intended to represent the complete private production codebase.

---

## Project Overview

The application provides a structured workflow for managing home-tuition requirements across three primary roles:

* **Students / Parents** — submit tuition requirements and track the request workflow.
* **Teachers** — apply to become tutors, submit verification documents, view assigned students, and manage scheduled demonstrations.
* **Administrators** — review teacher applications, verify tutors, assign tutors to requests, schedule demo classes, and manage the overall workflow.

The system combines a public-facing tutor/request experience with role-specific dashboards and protected backend APIs.

---

## Key Features

### Student / Parent Workflow

* Submit a tuition requirement through the public interface.
* Provide academic and location-related requirements.
* Initiate a tutor-matching workflow.
* Receive automated notifications throughout relevant workflow stages.

### Teacher Workflow

* Apply as a tutor through a multipart application form.
* Submit profile information and verification documents.
* Maintain an application state pending administrator review.
* Access a dedicated teacher dashboard after approval.
* View assigned students and scheduled demo classes.

### Administrator Workflow

* Review teacher applications.
* Approve or reject teacher applications.
* Manage verified tutor profiles.
* Assign eligible tutors to student requests.
* Schedule demo classes.
* Trigger workflow-related notifications.

### Authentication & Authorization

* JWT-based authentication.
* HTTP-only cookie support for authenticated sessions.
* Password hashing using bcrypt.
* Role-based access control for protected resources.
* Protected frontend routes based on authenticated user roles.
* Backend authorization middleware for role-specific APIs.

### Document Management

* Secure teacher document uploads.
* Support for JPEG, PNG, and PDF documents.
* 5 MB upload limit.
* Randomized server-side filenames.
* Uploaded files are stored outside the public static asset path.
* Authenticated access is required for document retrieval.

### Automated Communication

The application integrates transactional email notifications into important workflow events, reducing the need for manual communication between administrators, students/parents, and teachers.

---

## Technology Stack

### Frontend

* React 19
* Vite
* Material UI
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt
* Multer
* Helmet
* Rate Limiting

### Database & Storage

* MongoDB
* Mongoose
* Local protected document storage for uploaded verification files

### Communication

* Resend API for transactional email delivery

---

## Architecture

```text
┌──────────────────────────────────────────────┐
│                  React Client                │
│                                              │
│  Public Pages │ Auth │ Dashboards │ Routes  │
└───────────────────────┬──────────────────────┘
                        │
                     Axios
                        │
                        ▼
┌──────────────────────────────────────────────┐
│               Express Backend                │
│                                              │
│  Routes → Middleware → Controllers           │
│                │                             │
│       ┌────────┴────────┐                    │
│       │                 │                    │
│   JWT / RBAC        Validation               │
│   Security          Rate Limit               │
└──────────────┬───────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌───────────────┐
│   MongoDB    │  │ Email Service │
│  / Mongoose  │  │    / Resend   │
└──────────────┘  └───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Protected Document Storage   │
│ Teacher Verification Files   │
└──────────────────────────────┘
```

The frontend and backend are maintained in the same repository and are designed to operate as a unified application.

---

## Core Data Model

The backend separates different business concerns into dedicated MongoDB/Mongoose models.

| Model                | Responsibility                                                      |
| -------------------- | ------------------------------------------------------------------- |
| `User`               | Authentication credentials and user identity                        |
| `TeacherProfile`     | Searchable/public teacher information and current application state |
| `TeacherApplication` | Historical teacher application data and submitted documents         |
| `StudentRequest`     | Tuition requirement, workflow status, assignment and history        |
| `DemoClass`          | Demo scheduling information associated with a request and teacher   |

### Why separate `TeacherProfile` and `TeacherApplication`?

The separation prevents an application under review or a rejected application from directly affecting the active tutor directory.

`TeacherApplication` represents the application submitted for verification, while `TeacherProfile` represents the tutor's active platform profile.

This also provides a cleaner boundary between **application history** and **active platform data**.

---

## Important Engineering Decisions

### 1. Concurrency-Safe Tutor Assignment

Tutor assignment uses an atomic MongoDB update with a condition that the request must still have no assigned tutor.

Conceptually:

```text
Find request
    ↓
Verify assignedTeacher == null
    ↓
Atomically assign teacher
    ↓
Return updated request
```

This prevents two concurrent assignment operations from successfully assigning different tutors to the same request.

---

### 2. Role-Based Access Control

Authorization is enforced at the backend rather than relying only on frontend route protection.

The system distinguishes between roles such as:

```text
Public
  │
  ├── Student / Parent
  │
  ├── Teacher
  │
  └── Admin
```

Each protected API checks authentication and, where required, the user's role before allowing access.

---

### 3. Protected Verification Documents

Teacher verification documents are not exposed as ordinary public static files.

Access passes through authenticated and role-protected backend handling, while uploaded files use randomized filenames and controlled storage.

The submitted version also applies ownership validation so that a teacher cannot access another teacher's protected documents.

---

### 4. Workflow-Oriented Architecture

Rather than treating the application as independent CRUD screens, the backend models the actual business workflow:

```text
Student / Parent Request
          ↓
     Admin Review
          ↓
    Tutor Assignment
          ↓
    Demo Scheduling
          ↓
     Demo Completion
          ↓
   Follow-up / Feedback
```

Teacher onboarding follows a separate verification workflow:

```text
Teacher Application
        ↓
Document Submission
        ↓
Admin Verification
        ↓
Approval / Rejection
        ↓
Teacher Dashboard
```

This structure keeps business operations explicit and easier to maintain.

---

## Security Measures

The application incorporates multiple layers of backend security:

* JWT-based authentication
* HTTP-only authentication cookies
* bcrypt password hashing
* Role-based authorization
* Protected document routes
* Teacher document ownership validation
* Helmet security middleware
* Login rate limiting
* CORS configuration
* Request body limits
* File type restrictions
* File size restrictions
* Randomized uploaded-file names
* Environment-based production configuration
* Secrets excluded from version control

No production credentials or private environment configuration are included in this repository.

---

## API Design

The backend follows a REST-oriented API structure with separate routes and controllers for authentication, teachers, requests, demonstrations, and other application resources.

Examples of important operations include:

```text
POST   /api/teachers/apply
PATCH  /api/requests/:id/assign
POST   /api/.../demo
GET    /uploads/:filename
```

The exact available API surface should be inspected directly from the submitted source code, as this repository represents a privacy-preserving version of the original application.

---

## File Upload Flow

Teacher applications can contain verification documents.

```text
Teacher Application
        ↓
Multipart Request
        ↓
Multer Validation
        ↓
File Type / Size Validation
        ↓
Randomized Filename
        ↓
Protected Server Storage
        ↓
Database Reference
        ↓
Authorized Retrieval
```

Supported document formats include JPEG, PNG, and PDF, with a configured maximum file size of 5 MB.

---

## Email Automation

Transactional emails are integrated into relevant application workflows.

Examples include notifications related to:

* Teacher application status
* Teacher approval
* Tutor assignment
* Demo scheduling
* Workflow follow-up

The email layer is separated into a dedicated service rather than embedding email-delivery logic throughout individual controllers.

---

## Testing

The application has been tested through both:

### Manual Testing

Major user workflows were manually exercised across:

* Public request flows
* Teacher application flows
* Authentication
* Role-based dashboards
* Admin operations
* Tutor assignment
* Demo scheduling
* Document upload/retrieval
* Email-triggering workflows

### Automated Testing

Automated tests were also used as part of the development and validation process.

The repository should be evaluated based on the tests and implementation actually included in this submission version.

---

## Project Structure

```text
75 Way Project Task/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

The actual repository structure should be treated as the source of truth if files are reorganized in future revisions.

---

## Local Setup

### Prerequisites

* Node.js 18+
* MongoDB
* A configured transactional email service
* Git

### Clone Repository

```bash
git clone <GitHub Repository URL>
cd <repository-folder>
```

### Install Dependencies

Install dependencies for both the frontend and backend according to their respective `package.json` files.

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### Environment Configuration

The application requires backend environment configuration for items such as:

* MongoDB connection
* JWT secrets
* Email service credentials
* Runtime environment configuration

**No `.env` file or secret values are included in this repository.**

Configure the required variables locally before starting the backend.

### Run Development Environment

Start the backend using the repository's backend entry point and start the Vite frontend separately during development.

For production-style deployment, the frontend can be built and served through the Express application according to the project's deployment configuration.

---

## Production-Oriented Considerations

The application was designed with deployment and real-world operation in mind, including:

* Production environment detection
* Security middleware
* CORS configuration
* Rate limiting
* Protected authentication
* Controlled document storage
* REST API separation
* Database-backed workflow state
* Automated transactional communication
* Unified frontend/backend deployment architecture

The original application was delivered as a working freelance project for client use.

---

## Development Scope

This project was developed from the ground up as an **end-to-end freelance delivery within a 2–3 week development cycle**.

The implementation required adapting the application to evolving requirements while maintaining the core architecture, user workflows, backend integration, and deployment readiness.

---

## Privacy-Preserving Submission

This repository is intentionally different from the complete private production implementation.

For client confidentiality and respect for the original project, the submitted version may contain:

* Simplified functionality
* Reduced production-specific behavior
* Omitted client-specific features
* Removed private configuration
* Excluded confidential implementation details

These changes are intentional and do not represent accidental omissions from the original client delivery.

---

## What This Project Demonstrates

This project demonstrates practical experience across the complete full-stack development lifecycle:

* React application architecture
* REST API development
* Node.js / Express backend development
* MongoDB schema design
* Authentication and authorization
* Role-based access control
* Secure file handling
* Transactional email integration
* Concurrent database operations
* Business workflow modeling
* Frontend state management
* Protected routing
* Production-oriented security
* Testing and debugging
* End-to-end freelance project delivery

---

## Submission Information

**Project:** 75 Way Project Task
**Role:** End-to-End Full-Stack Developer
**Project Type:** Freelance / Real-World Application

> This repository has been prepared specifically as a technical evaluation submission while respecting the confidentiality of the original client project.
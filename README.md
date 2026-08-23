# MohiJobs

AI-Powered Job & Recruitment Platform

MohiJobs is a full-stack recruitment platform that connects job seekers with employers. It provides AI-powered resume analysis, AI mock technical interviews, intelligent job recommendations, job applications, interview scheduling, and recruitment analytics.

---

## 🌐 Live Demo

- **Frontend:** https://ai-job-portal-ehk1-two.vercel.app/
- **Backend API:** https://ai-job-portal-backend-hv62.onrender.com

---

## 🌟 Key Features

### 🔐 Authentication & Authorization

- **Firebase Authentication** – Email and password authentication.
- **Email Verification Guard** – Users must verify their email before accessing protected features.
- **Disposable Email Protection** – Blocks temporary/disposable email domains during registration.
- **Role-Based Access Control (RBAC)** – Separate permissions for:
  - Job Seeker
  - Employer
  - Admin
- **Protected Routes** – Private features cannot be accessed without authentication.

---

### 👤 Job Seeker Experience

- **Profile & Resume Management**
  - Candidate profile
  - Bio
  - Skills
  - PDF resume upload

- **AI Resume Analyzer**
  - ATS resume score
  - Strength analysis
  - Weakness/gap detection
  - Improvement suggestions

- **AI Mock Technical Interview**
  - Multiple developer roles
  - Beginner, Intermediate and Advanced difficulty
  - AI-generated interview questions
  - Timed questions
  - Answer evaluation
  - Score out of 10
  - Strengths and improvements
  - Ideal answer

- **AI Job Recommendations**
  - Skill matching
  - Role relevance
  - Experience matching
  - Location/work-mode matching

- **Advanced Job Search**
  - Keywords
  - Location
  - Employment type
  - Work mode
  - Experience
  - Skills
  - Salary range

- **Job Applications**
  - One-click applications
  - Resume attachment
  - Cover letter
  - Duplicate application protection
  - Application status tracking

- **Saved Jobs**
  - Bookmark jobs
  - View saved jobs later

- **Notifications**
  - Application updates
  - Interview notifications
  - Status changes

---

### 🏢 Employer Experience

- **Employer Dashboard**
  - Active jobs
  - Applications
  - Interviews
  - Recruitment overview

- **Job Management**
  - Create jobs
  - Edit jobs
  - Publish jobs
  - Close jobs

- **Applicant Management**
  - View applicants
  - View candidate profiles
  - Download resumes
  - Update application status

- **Company Profile**
  - Company name
  - Logo
  - Description
  - Website
  - Company size

- **Interview Scheduling**
  - Schedule interviews
  - Online/in-person interviews
  - Meeting links
  - Time conflict detection
  - Interview notifications

- **Recruitment Analytics**
  - Application trends
  - Interview rates
  - Selection rates
  - Job performance
  - 7-day analytics
  - 30-day analytics
  - 90-day analytics
  - All-time analytics

---

### 🤖 AI Capabilities

#### AI Resume Analyzer

Powered by Google Gemini AI and PDF text extraction.

It analyzes:

- Overall ATS score
- Candidate summary
- Technical skills
- Strengths
- Weaknesses
- ATS improvements
- Project improvements
- Final recommendations

#### AI Mock Technical Interview

The AI interviewer:

1. Generates role-specific questions.
2. Provides a time limit.
3. Accepts the candidate's answer.
4. Evaluates the answer.
5. Generates a score from 0–10.
6. Shows strengths.
7. Shows areas for improvement.
8. Provides feedback.
9. Provides an ideal answer.
10. Calculates the final average score.

#### AI Job Match Engine

Provides transparent job matching based on:

- Skills – 60%
- Role relevance – 20%
- Experience – 10%
- Location/work mode – 10%

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- React Icons
- Recharts
- pdfjs-dist
- react-markdown
- Google Generative AI SDK

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Admin SDK
- JWT
- bcryptjs
- CORS

### Database

- MongoDB Atlas

### Authentication

- Firebase Authentication

### AI

- Google Gemini

---

## 🔒 Security & Architecture

### 1. Authentication

Protected application features require an authenticated user.

AI Resume Analyzer and AI Mock Interview are also protected and cannot be accessed by unauthenticated users.

### 2. Role-Based Access Control

The application separates users into:

- Job Seeker
- Employer
- Admin

Each role can access only the features permitted for that role.

### 3. Server-Side Identity

Protected backend endpoints derive the authenticated user's identity from verified authentication tokens instead of trusting client-provided user IDs.

### 4. Resource Ownership

Employers can only access and modify their own:

- Jobs
- Company profile
- Applicants
- Recruitment data

Unauthorized cross-user access is rejected.

### 5. Input Protection

The backend uses explicit field validation and parameter whitelisting to prevent unauthorized modification of protected fields.

### 6. MongoDB Security

MongoDB ObjectIds are validated before database queries to prevent invalid requests and query-related errors.

### 7. CORS

Production API access is restricted to configured frontend origins.

### 8. Environment Variables

Sensitive credentials such as:

- MongoDB URI
- JWT secret
- Firebase credentials
- Gemini API key

are stored in environment variables and should never be committed to GitHub.

---

## 📁 Project Structure

```text
MohiJobs/
│
├── Backend/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── firebaseAdmin.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── employerMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Interview.js
│   │   ├── Notification.js
│   │   └── SavedJob.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applications.js
│   │   ├── companyRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   └── firebase.js
│   │
│   ├── .env.example
│   └── package.json
│
└── README.md
```

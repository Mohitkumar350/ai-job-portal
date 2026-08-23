# MohiJobs
## 🌐 Live Demo

- **Frontend:** https://ai-job-portal-ehk1-two.vercel.app/
- **Backend API:** https://ai-job-portal-backend-hv62.onrender.com
AI-Powered Job & Recruitment Platform

A production-ready, full-stack recruitment platform connecting job seekers with employers, powered by AI resume analysis, interactive AI mock technical interviews, and deterministic weighted AI job recommendations.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization

- **Firebase Authentication**: Email & password authentication with email verification enforcement.
- **Email Verification Guard**: Stale auth resolution with user.reload() verification before session initialization.
- **Disposable Email Protection**: Domain validation blocking temporary / disposable emails at registration.
- **Role-Based Access Control (RBAC)**: Secure server-side isolation for **Job Seeker**, **Employer**, and **Admin** roles with zero trust for client-supplied identity.

### 👤 Job Seeker Experience

- **Profile & Resume Management**: Complete candidate profiles, bio, skills management, and PDF resume upload.
- **AI Job Recommendations**: Deterministic 4-factor recommendation engine matching profile skills (60%), role relevance (20%), experience (10%), and location/work mode (10%).
- **Advanced Job Search**: Instant multi-criteria filtering by keywords, location, employment type (Full-Time, Part-Time, Internship, Contract), work mode (Remote, On-Site, Hybrid), experience, skills, and salary ranges.
- **Sorting & Server-Side Pagination**: Sort by newest, oldest, salary high-to-low, salary low-to-high, and best match with responsive pagination.
- **Job Applications**: 1-click job applications with resume attachment, cover letters, duplicate application protection, and live status tracking (Applied, Under Review, Interview Scheduled, Selected, Rejected).
- **Saved Jobs**: Bookmark jobs for later viewing.
- **In-App Notifications**: Real-time updates when applications are reviewed, interviews are scheduled, or statuses change.

### 🏢 Employer Experience

- **Employer Dashboard**: High-level workspace overview of active postings, incoming candidate submissions, and interview milestones.
- **Job Lifecycle Management (CRUD)**: Create, edit, publish, and close job postings with verified ownership enforcement.
- **Applicant Review & Status Pipeline**: Inspect applicant profiles, download resumes, and advance candidates through recruitment stages.
- **Company Profile Management**: Maintain company branding, logo, description, website, size, and public company pages.
- **Interview Scheduling**: Schedule online and in-person interviews with meeting links, time conflict detection, and notifications.
- **Recruitment Analytics**: Comprehensive metrics on job performance, status distribution, selection rates, interview rates, and application trends over 7d, 30d, 90d, and all-time windows.

### 🤖 AI Capabilities

- **AI Resume Analyzer**: Powered by Google Gemini AI and PDF text extraction, evaluating overall ATS score, strengths, gaps, and actionable recommendations.
- **AI Mock Technical Interview**: Interactive AI interviewer evaluating candidate responses across multiple developer roles and difficulty levels with detailed scoring and feedback.
- **AI Job Match Engine**: Computes transparent percentage match scores with itemized matched skills, missing skills, and context explanations.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, React Router v7, React Icons, Recharts, pdfjs-dist, react-markdown, @google/generative-ai
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, Firebase Admin SDK, JWT, bcryptjs, cors
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Authentication
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)

---

## 🔒 Security & Architecture Standards

1. **Server-Side Identity Derivation**: All protected endpoints derive identity directly from verified JWT / Firebase tokens (
   eq.userId).
2. **Resource Ownership Guards**: Employers can only modify/view their own jobs, company profile, and applicant lists. Cross-tenant access is rejected with 403 Forbidden.
3. **Input Sanitization & Mass-Assignment Protection**: Explicit parameter whitelisting prevents unauthorized modification of internal role, owner, or status fields.
4. **MongoDB Security**: Strict ObjectId validation to prevent query injection and unhandled cast errors.
5. **Security Headers**: Standard HTTP security headers configured (nosniff, DENY framing, XSS protection).
6. **Scoped CORS**: Restricted origins in production to prevent cross-origin exploitation of private APIs.

---

## 📁 Project Structure

`├── Backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── firebaseAdmin.js      # Firebase Admin SDK init
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & req.userId extraction
│   │   ├── employerMiddleware.js # Employer role verification
│   │   └── adminMiddleware.js    # Admin role verification
│   ├── models/
│   │   ├── User.js               # User & candidate profile schema
│   │   ├── Job.js                # Job posting schema
│   │   ├── Application.js        # Job application schema (unique compound index)
│   │   ├── Company.js            # Employer company profile
│   │   ├── Interview.js          # Interview schedule schema
│   │   ├── Notification.js       # In-app notifications
│   │   └── SavedJob.js           # Bookmarked jobs
│   ├── routes/
│   │   ├── authRoutes.js         # Firebase login, OTP, verification link helper
│   │   ├── jobRoutes.js          # Job CRUD, search, filter, sort, paginate
│   │   ├── applications.js       # Apply, candidate tracking, employer applicant review
│   │   ├── companyRoutes.js      # Company profile & public pages
│   │   ├── interviewRoutes.js    # Interview scheduling & management
│   │   ├── analyticsRoutes.js    # Recruitment analytics aggregations
│   │   ├── recommendationRoutes.js# AI job recommendation engine
│   │   ├── notificationRoutes.js # In-app notification management
│   │   └── userRoutes.js         # Profile management
│   ├── server.js                 # Express application entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, JobCard, FilterBar, etc.)
│   │   ├── context/              # AuthContext & SavedJobsContext
│   │   ├── pages/                # Route pages (Jobs, RecommendedJobs, Dashboard, Employer, etc.)
│   │   ├── services/             # API clients (jobService, recommendationService, etc.)
│   │   ├── routes/AppRoutes.jsx  # Application routing & RoleRoute protection
│   │   └── firebase.js           # Client-side Firebase SDK configuration
│   ├── .env.example
│   └── package.json
└── README.md`

---

## ⚙️ Environment Setup & Local Development

### 1. Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or MongoDB Atlas)
- Firebase Project with Authentication enabled (Email/Password)
- Google Gemini API Key

### 2. Backend Setup

`ash
cd Backend
npm install
`
Create Backend/.env based on Backend/.env.example:
`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
`
Place your Firebase Admin service account key JSON in Backend/firebase-service-account.json.

Start the backend server:
`ash
npm run dev

# Server running at http://localhost:5000

`

### 3. Frontend Setup

`ash
cd frontend
npm install
`
Create rontend/.env based on rontend/.env.example:
`env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
`

Start Vite development server:
`ash
npm run dev

# Running at http://localhost:5173

`

---

## 🚀 Production Build & Deployment

### Production Build

`ash
cd frontend
npm run build
`

### Deployment Targets

- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

---

## 📄 Scope Notice

_Note: Real-time messaging, WebRTC, and video interviews are intentionally excluded per project requirements in favor of in-app structured interview management._

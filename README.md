<h1 align="center">✨ CodeVerse - Real-time Collaborative Coding Platform ✨</h1>


**CodeVerse** is the ultimate platform for real-time collaborative coding. Connect face-to-face, solve problems together, and level up your skills with instant feedback and live collaboration.

✨ Highlights:

- 🧑‍💻 VSCode-Powered Code Editor with Multi-Language Support
- 🔐 Secure Authentication via Clerk
- 🎥 1-on-1 Real-time Video Collaboration Rooms
- 📊 Interactive Dashboard with Live Stats
- 🔊 Crystal Clear Mic & Camera Toggle, Screen Sharing & Recording
- 💬 Real-time Chat Messaging for Instant Communication
- ⚙️ Secure Code Execution in Isolated Environment
- 🎯 Intelligent Auto Feedback — Success / Fail based on test cases
- 🎉 Confetti on Success + Toast Notifications on Fail
- 🧩 Practice Problems Page (solo coding mode)
- 🔒 Room Locking — allows only 2 participants per session
- 🧰 REST API with Node.js & Express
- ⚡ Data Fetching & Caching via TanStack Query
- 🤖 Code Quality & Performance Analysis
- 🧑‍💻 Git & GitHub Workflow (branches, PRs, merges)
- 🚀 Cloud Deployment Ready

---

## 🧪 .env Setup

### Backend (`/backend`)

```bash
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend`)

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_API_URL=http://localhost:3000/api

VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🔧 Run the Backend

```bash

cd backend
npm install
npm run dev
```

---

## 🔧 Run the Frontend

```
bash
cd frontend
npm install
npm run dev
```

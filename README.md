# ⚖️ LexiAI – AI-Powered Legal Document Assistant

LexiAI is an AI-powered web application that helps users understand complex legal documents by simplifying legal language, highlighting risky clauses, and generating easy-to-read summaries.

This project is being developed as a **B.Tech Final Year Major Project** using the MERN Stack and AI technologies.

---

# 🚀 Project Overview

Legal agreements such as rental contracts, employment agreements, loan documents, and Terms & Conditions are often difficult for ordinary users to understand.

LexiAI allows users to upload legal documents and uses AI to:

- Explain legal clauses in simple language
- Identify risky clauses
- Highlight important legal terms
- Generate AI-powered summaries
- Support English and Hindi explanations (Future Scope)

---

# ✨ Planned Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Role-based Access (User/Admin)

## AI Document Analysis

- Upload PDF Documents
- OCR Support (Future)
- AI Clause Explanation
- Risk Detection
- Plain Language Summary
- Clause-by-Clause Analysis

## Dashboard

- User Dashboard
- Upload History
- Analysis History
- Download Reports

## Admin Panel

- User Management
- Document Monitoring
- Analytics Dashboard

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer

## AI

- Google Gemini API
- Prompt Engineering

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📁 Project Structure

```
LexiAI/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docs/
├── uploads/
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/pragatipandey25/Lexi-AI.git
cd LexiAI
```

---

## Install Dependencies

### Root

```bash
npm install
```

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

---

# ▶️ Run the Project

## Backend

```bash
cd server
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

## Frontend

```bash
cd client
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 📡 Current API Endpoints

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

---

# 🎯 Project Roadmap

## Phase 1

- Project Setup
- MongoDB Integration
- Authentication
- Landing Page

## Phase 2

- Dashboard
- PDF Upload
- Multer Integration
- File Storage

## Phase 3

- Gemini AI Integration
- Clause Extraction
- Legal Risk Detection
- AI Summary Generation

## Phase 4

- Download Report
- User History
- Admin Dashboard
- Deployment

---

# 🎓 Academic Information

**Project Title**

**LexiAI – AI-Powered Legal Document Assistant**

**Project Type**

B.Tech Final Year Major Project

**Duration**

August 2026 – September 2026

---

# 👨‍💻 Developer

**Pragati Pandey**

B.Tech Computer Science Engineering

Final Year Project

---

# ⭐ Future Scope

- Hindi Language Support
- OCR for Scanned Documents
- Voice-Based Legal Explanation
- AI Chat Assistant
- Document Comparison
- Legal Recommendation Engine
- Mobile Application

---

# 📌 Project Status

🚧 Currently Under Development

Version: **v0.1.0**

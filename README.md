# LexiAI — AI-Powered Legal Document Assistant
> **Final-Year Major Project | Department of Computer Science & Engineering**  
> *Full-Stack MERN Application with Google Gemini AI & Hybrid OCR Pipeline*

---

## 1. Project Overview

**LexiAI** is an advanced legal technology web application built to empower individuals, law students, and businesses to decode dense legal contracts, identify one-sided risks, detect suspicious anomalies, ask document-grounded questions, monitor obligations, and generate audit-ready PDF reports.

The application simplifies convoluted legalese into plain English and Hindi without claiming to replace a qualified lawyer, adhering to responsible AI principles.

---

## 2. Key System Architecture

```
                      +---------------------------------------+
                      |       Client (React + Vite + TW)      |
                      |  - Landing, Auth, Dashboard, Upload   |
                      |  - Doc Viewer, AI Analysis, Chat      |
                      |  - Risk Scanner, Clause Categories    |
                      |  - Obligations, Compare, PDF Reports  |
                      +-------------------+-------------------+
                                          | REST API (Axios + JWT)
                                          v
                      +---------------------------------------+
                      |     Server (Node.js + Express.js)     |
                      |  - Auth & Security Middleware         |
                      |  - Document & Storage Manager         |
                      |  - Hybrid PDF / OCR Pipeline          |
                      |  - Gemini AI Intelligence Services    |
                      |  - Report Generator (PDFKit)          |
                      +-------------------+-------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
          +-----------------------+               +-----------------------+
          |   MongoDB Database    |               |    Google Gemini AI   |
          |  - Users              |               |  - Summary & Analysis |
          |  - Documents          |               |  - Risk/Suspicious    |
          |  - Analyses & Clauses |               |  - Grounded Chat      |
          |  - Obligations        |               |  - Bilingual (EN/HI)  |
          |  - Chat Messages      |               |  - Document Diff      |
          +-----------------------+               +-----------------------+
```

---

## 3. The 10 Core Modules

| Module # | Feature Name | Description & Tech Highlights |
|---|---|---|
| **01** | **Smart Document Processing** | Ingests PDF contracts with digital text extraction via `unpdf` and fallback to `tesseract.js` OCR for scanned photocopies. Handles empty, corrupted, and encrypted files gracefully. |
| **02** | **AI Legal Analysis** | Generates executive summaries, apparent document type, party rights & responsibilities, key terms, and plain-language translations using Gemini 1.5/2.0 Flash. |
| **03** | **Risk & Suspicious Scanner** | Dual-pipeline diagnostic tool identifying **Legal Risks** (unilateral indemnities, harsh lock-in penalties) and **Suspicious Anomalies** (contradictory dates, party name conflicts) with High/Medium/Low severity filters. |
| **04** | **AI Document Chat** | Interactive conversational assistant grounded strictly in the selected contract corpus. Generates evidence-backed answers with exact clause citations and refuses to hallucinate facts. |
| **05** | **Bilingual Explanations** | One-click toggle between plain **English** and **Hindi (हिंदी)** contract deconstructions, accompanied by an interactive Legal Terms Glossary. |
| **06** | **Clause Categorization** | Automatically parses and tags clauses into 11 legal domains: *Payment & Fees, Termination, Confidentiality, Liability & Indemnity, Dispute Resolution, Renewal, Obligations, Intellectual Property, Privacy, Governing Law, and Miscellaneous*. |
| **07** | **Obligation & Deadline Tracker** | Extracts explicit commitments, responsible parties, and due dates with interactive status tracking (*Pending*, *Completed*, *Overdue*). |
| **08** | **Interactive Dashboard** | Real-time analytics dashboard with Recharts visualizations (risk severity donut chart, clause category distribution) and aggregated database statistics. |
| **09** | **Dual Document Comparison** | Side-by-side contract diffing tool revealing omissions, clause additions, payment term modifications, and overall risk profile shifts. |
| **10** | **Downloadable PDF Audit Report** | Generates executive multi-page audit reports via `PDFKit` complete with summary, risk diagnostics, cited evidence, deadlines, and legal disclaimers. |

---

## 4. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom legal tech palette
- **Routing:** React Router v6
- **HTTP Client:** Axios (with request & response token interceptors)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (responsive pie/donut and bar charts)

### Backend
- **Runtime:** Node.js v22 (ES Modules)
- **Framework:** Express.js 4
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **File Uploads:** Multer with file type & size limits
- **PDF Extraction:** `unpdf` (maintained modern Mozilla PDF.js engine)
- **OCR Engine:** `tesseract.js` for scanned PDFs and image layers
- **Report Generation:** `pdfkit` for high-resolution multi-page PDF exports

### Artificial Intelligence
- **SDK:** Official `@google/generative-ai` SDK
- **Models:** Google Gemini 1.5 Flash / Gemini 2.0 Flash
- **Output Mode:** Guaranteed structured JSON (`responseMimeType: "application/json"`)
- **Safety:** Isolation of untrusted document corpus against prompt injection

---

## 5. Getting Started & Setup

### Prerequisites
1. **Node.js**: v18+ (tested on v22.14.0)
2. **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/lexiai`) or MongoDB Atlas URI
3. **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 1: Environment Configuration
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/lexiai
JWT_SECRET=lexiai_secret_jwt_major_project_token_2026_xyz
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
MAX_FILE_SIZE_MB=15
```

> **Note:** If `GEMINI_API_KEY` is left blank in `.env`, users can still configure their personal key directly inside the LexiAI web UI under **Settings & Key** or via the **Configure AI Key** modal.

### Step 2: Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 3: Run the Development Servers
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite will launch on http://localhost:5173
```

---

## 6. Running Verification Tests

Run the full end-to-end integration test suite verifying all 12 validation checkpoints:

```bash
cd server
npm test
```

This verifies:
1. User registration & JWT authentication
2. Multipart PDF upload & digital text extraction
3. Multi-document upload & storage isolation
4. Graceful error handling for missing/unconfigured API keys
5. Data schema validation & Mongoose model persistence
6. Full AI legal analysis retrieval
7. Risk & suspicious anomaly severity filtering
8. Clause categorization & keyword search
9. Bilingual explanations (English & Hindi)
10. Contractual obligation status updates
11. Real-time dashboard database aggregations
12. Multi-page downloadable PDF audit report generation via PDFKit

---

## 7. Viva & Demonstration Walkthrough

When presenting to external examiners, follow this recommended walkthrough:

1. **Landing Page:** Show the clean legal technology design, the 10-module capability grid, execution pipeline, and legal information disclaimer.
2. **Demo Login / Registration:** Use the **"Fill Quick Demo Credentials"** button on the Login page (`demo@lexiai.org`) or create a new user account.
3. **Document Ingestion:** Navigate to **Upload PDF** and upload `server/tests/Sample_Commercial_Lease.pdf`. Observe digital text extraction, page counting, and word count statistics.
4. **AI Legal Audit:** Click **"Run AI Legal Audit"** to execute Gemini analysis. Review the Executive Summary, Party Allocation, and Unfavorable Terms.
5. **Risk & Suspicious Scanner:** Open the **Risks & Suspicious** tab. Demonstrate filtering by *Legal Risks* vs. *Suspicious Indicators*, and filter by *High Severity* (e.g. Unilateral Gross Negligence Indemnity). Highlight exact quoted evidence and recommended next actions.
6. **Clause Categorization:** Switch to **Clause Categories**. Filter by *Liability and Indemnity*, *Payment and Fees*, or *Termination*.
7. **Bilingual Deconstruction:** Open the **English & Hindi** tab. Toggle to **हिंदी व्याख्या** to show plain Hindi translation and the legal terms glossary.
8. **Document Chat:** Ask grounded questions in the **Document Chat** (e.g., *"What is the notice period for termination?"*). Show the citation bubble citing the exact clause.
9. **Obligations & Deadlines:** View extracted obligations. Mark rent payment as *Completed*. Switch to the global **Obligations** page to view user-wide commitments.
10. **Dual Document Comparison:** Navigate to **Compare Docs**, select the Commercial Lease and Mutual NDA, and view the automated comparison matrix, exclusive clauses, and risk shifts.
11. **PDF Report Export:** Click **"Download PDF Audit Report"** to generate a publication-quality PDF audit.
12. **Live Dashboard:** Return to the **Dashboard** to show real-time Recharts visualizations and live database statistics.

---

## 8. License & Academic Credits

Developed as a Final-Year Major Project for Bachelor of Technology in Computer Science & Engineering.  
*Educational & Research Purpose. Not intended as substitute for qualified legal advice.*

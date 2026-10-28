# LexiAI — AI-Powered Legal Document Assistant
> **Project Owner & Lead Architect: Pragati Pandey**  
> *Final-Year Major Project | B.Tech Computer Science & Engineering*  
> *Full-Stack Production MERN Application with Google Gemini AI & Hybrid OCR Pipeline*

---

## 1. Executive Summary

**LexiAI** is an enterprise-grade legal technology platform architected and developed by **Pragati Pandey**. It empowers individuals, legal counsels, and corporate teams to rapidly decode complex contracts, detect one-sided liabilities, flag drafting contradictions, ask document-grounded questions with cited evidence, track compliance deadlines, and generate courtroom-grade PDF audit reports.

LexiAI bridges the gap between dense legalese and plain language (English & Hindi) without claiming to replace qualified lawyers, strictly adhering to responsible AI guidelines.

---

## 2. Project Owner & Credits

- **Project Lead & Software Architect:** Pragati Pandey
- **Email:** [pragatipandey454@gmail.com](mailto:pragatipandey454@gmail.com)
- **Role:** Full-Stack MERN Developer, AI Systems Engineer, UI/UX Designer
- **Academic Degree:** Bachelor of Technology in Computer Science & Engineering
- **Production Version:** 1.0.0 (Production Ready)

---

## 3. High-Level System Architecture

```
                      +---------------------------------------+
                      |       Client (React + Vite + TW)      |
                      |  - Features Workshop, Auth, Dashboard |
                      |  - Doc Viewer, AI Analysis, Chat      |
                      |  - Risk Scanner, Clause Categories    |
                      |  - Obligations, Compare, PDF Reports  |
                      +-------------------+-------------------+
                                          | REST API (Axios + JWT)
                                          v
                      +---------------------------------------+
                      |     Server (Node.js + Express.js)     |
                      |  - Helmet, Rate Limiter, CORS         |
                      |  - Storage Manager (Multer + unpdf)   |
                      |  - Hybrid PDF / Tesseract OCR Engine  |
                      |  - Multi-Model Gemini AI Service      |
                      |  - Vector PDFKit Report Generator     |
                      +-------------------+-------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
          +-----------------------+               +-----------------------+
          |  MongoDB Atlas Cloud  |               |    Google Gemini AI   |
          |  - Users (Owner/Role) |               |  - gemini-3-flash     |
          |  - Documents          |               |  - Executive Summary  |
          |  - Analyses & Clauses |               |  - Grounded Chat      |
          |  - Obligations        |               |  - Bilingual (EN/HI)  |
          |  - Chat Messages      |               |  - Cross-Doc Diff     |
          +-----------------------+               +-----------------------+
```

---

## 4. Core Legal AI Modules

| Module # | Feature Name | Description & Technical Implementation |
|---|---|---|
| **01** | **Smart Document Processing** | Ingests PDF contracts with digital text extraction via `unpdf` and fallback to `tesseract.js` OCR for scanned photocopies. Validates MIME types, sizes, and handles encrypted or corrupted files gracefully. |
| **02** | **AI Legal Analysis** | Structured extraction of executive summary, apparent document type, party rights & responsibilities, key terms, and plain-language translations using Google Gemini AI. |
| **03** | **Risk & Suspicious Scanner** | Dual-pipeline diagnostic tool identifying **Legal Risks** (unilateral indemnities, harsh lock-in penalties) and **Suspicious Anomalies** (contradictory dates, party name conflicts) with High/Medium/Low severity filters. |
| **04** | **AI Document Chat** | Interactive conversational assistant grounded strictly in the selected contract corpus. Generates evidence-backed answers with exact clause citations and prevents hallucination. |
| **05** | **Bilingual Explanations** | One-click toggle between plain **English** and **Hindi (हिंदी)** contract deconstructions, accompanied by an interactive Legal Terms Glossary. |
| **06** | **Clause Categorization** | Automatically parses and tags clauses into 11 legal domains: *Payment & Fees, Termination, Confidentiality, Liability & Indemnity, Dispute Resolution, Renewal, Obligations, Intellectual Property, Privacy, Governing Law, and Miscellaneous*. |
| **07** | **Obligation & Deadline Tracker** | Extracts explicit commitments, responsible parties, and due dates with interactive status tracking (*Pending*, *Completed*, *Overdue*). |
| **08** | **Dual Document Comparison** | Cross-contract comparison revealing textual omissions, clause additions, payment term modifications, and overall risk profile shifts. |
| **09** | **Downloadable PDF Audit Report** | Generates publication-ready PDF audit reports via `PDFKit` complete with summary, risk diagnostics, cited evidence, deadlines, and legal disclaimers. |
| **10** | **Interactive Dashboard** | Live oversight with Recharts visualizations (risk severity charts, clause breakdown) and real-time database aggregations. |

---

## 5. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with modern legal-tech design system
- **Routing:** React Router v6
- **HTTP Client:** Axios (with request & response token interceptors)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (responsive pie/donut and bar charts)

### Backend
- **Runtime:** Node.js v22 (ES Modules)
- **Framework:** Express.js 4
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing and role-based permissions (`owner`, `admin`, `user`)
- **Security:** `helmet`, `express-rate-limit`, `cors`
- **File Uploads:** Multer with file type & size limits (15MB)
- **PDF Extraction:** `unpdf` (maintained modern Mozilla PDF.js engine)
- **OCR Engine:** `tesseract.js` for scanned PDFs and image layers
- **Report Generation:** `pdfkit` for high-resolution vector PDF exports

### Artificial Intelligence
- **SDK:** Official `@google/generative-ai` SDK
- **Models:** Primary `gemini-3-flash-preview` with automatic multi-model fallback (`gemini-3.8-flash`, `gemini-2.5-flash-lite`, `gemini-flash-latest`)
- **Output Guarantee:** Clean JSON parsing with code fence stripping
- **Safety:** Corpus isolation against prompt injection

---

## 6. Production Setup & Installation

### Prerequisites
1. **Node.js**: v18+ (tested on v22.14.0)
2. **MongoDB**: MongoDB Atlas URI or local instance
3. **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 1: Environment Variables
Configure `server/.env`:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/lexiai
JWT_SECRET=your_secure_production_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
MAX_FILE_SIZE_MB=15
```

### Step 2: Build the Production Client
```bash
# In client directory
cd client
npm install
npm run build
```

### Step 3: Start the Production Server
```bash
# In server directory
cd server
npm install
npm run prod
# Server runs with security headers, rate limiting, and suppressed stack traces
```

---

## 7. Major Project Presentation & Viva Walkthrough Guide

When presenting to examiners or evaluators, use the following structured demonstration:

1. **Homepage & Features Workshop:**
   - Open [http://localhost:5173](http://localhost:5173).
   - Click **"Features Workshop"** in the top navigation bar to showcase the interactive simulation modal demonstrating all 9 AI modules on a 14-page Commercial Property Lease.
2. **Authentication & Owner Account:**
   - Sign in using your registered owner account (`pragatipandey454@gmail.com`).
   - Navigate to **Settings** to showcase the **Project Owner & Lead** verified badge.
3. **Document Ingestion & Text Extraction:**
   - Navigate to **Upload PDF**. Upload any legal contract or click **"Load Standard Lease Agreement Template"**.
   - Observe automatic digital text extraction (`unpdf`) with OCR fallback capability.
4. **AI Legal Audit & Clause Deconstruction:**
   - Run AI Legal Analysis. Demonstrate the Executive Summary, Allocation of Responsibilities, and Unfavorable Terms.
5. **Risk & Suspicious Scanner:**
   - Open the **Risks & Suspicious** tab. Filter by *High Severity* (e.g. Unilateral Gross Negligence Indemnity). Show the verbatim quoted evidence and recommended action.
6. **Bilingual Hindi & English Mode:**
   - Open the **English & Hindi** tab. Toggle to **हिंदी व्याख्या** to show colloquial Hindi legal translation and the Legal Terms Glossary (*Indemnification*, *Liquidated Damages*).
7. **Document-Grounded Chat:**
   - Ask contract questions (*"What is the notice period for termination?"*). Show the answer with the exact cited clause bubble.
8. **Compliance Tracker:**
   - View extracted obligations, due dates, and priority badges. Toggle completion status in real-time.
9. **Cross-Contract Comparison:**
   - Navigate to **Compare Docs**. Select baseline and counter-draft contracts (or click **"Load Comparison Templates"**). Review the side-by-side differences in escalation, security deposits, and overall risk shift.
10. **Executive PDF Audit Report:**
    - Click **"Download PDF Audit Report"** to export a vector PDF compiled via `pdfkit` containing complete findings, evidence quotes, and legal disclaimers.

---

## 8. License

Copyright © 2026 Pragati Pandey. All rights reserved.  
Released under the MIT License for educational, research, and non-commercial academic evaluation.

# 🧠 LexiAI

A full-stack web application built with **React + Vite** on the frontend and **Express.js + MongoDB** on the backend, featuring JWT-based user authentication.

---

## ✨ Features

- 🔐 **User Authentication** — Register and login with JWT-based authentication (7-day token expiry)
- 👥 **Role-Based Access** — Supports `user` and `admin` roles
- 📁 **File Upload** — Multer-based file upload handling
- 🗄️ **MongoDB Integration** — Mongoose ODM with schema validation
- ⚡ **React + Vite** — Fast HMR development experience
- 🧾 **React Hook Form** — Performant form validation
- 🔔 **Toast Notifications** — User-friendly feedback via React Hot Toast
- 🛡️ **Password Hashing** — Secure bcrypt hashing (10 salt rounds)
- 🌐 **CORS Enabled** — Cross-origin resource sharing configured

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                    |
| ------------- | ----------------------------------------------------------------------------- |
| **Frontend**  | React 19, Vite 8, React Router DOM 7, Axios, React Hook Form, React Hot Toast |
| **Backend**   | Node.js, Express.js 5, Mongoose 9, JWT, bcrypt, Multer                        |
| **Database**  | MongoDB                                                                       |
| **Dev Tools** | Nodemon, ESLint                                                               |

---

## 📁 Project Structure

```
lexiai/
├── client/                    # React + Vite frontend
│   ├── public/                # Static assets (favicon, icons)
│   ├── src/
│   │   ├── assets/            # Images and media
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css            # App styles
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── server/                    # Express.js backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Auth logic (register, login)
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification middleware
│   ├── models/
│   │   └── User.js            # User schema (name, email, password, role)
│   ├── routes/
│   │   └── authRoutes.js      # Auth API routes
│   ├── services/              # Business logic services
│   ├── uploads/               # Uploaded files directory
│   ├── utils/                 # Utility functions
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   └── package.json
│
├── docs/                      # Documentation
├── uploads/                   # Root uploads directory
├── package.json               # Root dependencies (validator)
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lexia.git
cd lexiai
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 3. Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lexia
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Run the application

#### Start the backend server

```bash
cd server
npm run dev    # with Nodemon (auto-restart)
# or
npm start      # production mode
```

#### Start the frontend client

```bash
cd client
npm run dev    # Vite dev server (default: http://localhost:5173)
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| `GET`  | `/`                  | Health check        | ❌            |
| `POST` | `/api/auth/register` | Register a new user | ❌            |
| `POST` | `/api/auth/login`    | Login user          | ❌            |

### Response Format

**Success:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 🧑‍💻 User Model

| Field      | Type   | Required | Constraints                                       |
| ---------- | ------ | -------- | ------------------------------------------------- |
| `name`     | String | ✅       | 3–50 characters                                   |
| `email`    | String | ✅       | Valid email, unique, lowercase                    |
| `password` | String | ✅       | Min 6 characters, hashed, not selected by default |
| `role`     | String | ❌       | `user` or `admin` (default: `user`)               |

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

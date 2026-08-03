const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const app = express();

app.use(cors());
app.use(express.json());

// Clerk is the single authentication provider.
// It verifies the Clerk JWT on incoming requests and attaches
// the authenticated user to req.auth.
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({
    message: "LexiAI Backend Running 🚀",
  });
});

module.exports = app;

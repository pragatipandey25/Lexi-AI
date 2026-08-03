const { requireAuth } = require("@clerk/express");

/**
 * @desc    Protect a route by verifying the Clerk JWT token.
 * @usage   app.get("/api/protected", requireAuth, handler)
 * @access  Private
 *
 * On success, `req.auth.userId` is populated with the authenticated
 * Clerk user's ID. On failure, Clerk responds with a 401.
 */
const protect = requireAuth;

module.exports = { protect };

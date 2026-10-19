import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Access denied. No authentication token provided.', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'lexiai_secret_jwt_major_project_token_2026_xyz'
    );

    // Retrieve user and include geminiApiKey field to pass to AI service if needed
    const user = await User.findById(decoded.id).select('+geminiApiKey');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired authentication token.', 401);
  }
};

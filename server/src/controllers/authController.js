import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lexiai_secret_jwt_major_project_token_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please provide name, email, and password', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasCustomApiKey: false,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password +geminiApiKey');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasCustomApiKey: Boolean(user.geminiApiKey),
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
        token,
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+geminiApiKey');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      hasCustomApiKey: Boolean(user.geminiApiKey),
      preferences: user.preferences,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Configure or clear Gemini API key
// @route   PUT /api/auth/api-key
// @access  Private
export const updateApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.geminiApiKey = apiKey ? apiKey.trim() : '';
    await user.save();

    return successResponse(
      res,
      {
        hasCustomApiKey: Boolean(user.geminiApiKey),
      },
      apiKey ? 'Gemini API key configured successfully' : 'Custom Gemini API key cleared'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Check system configuration status (e.g. server AI key present)
// @route   GET /api/auth/system-status
// @access  Public
export const getSystemStatus = async (req, res) => {
  const serverKeyConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5);
  return successResponse(res, {
    serverKeyConfigured,
    modelName: 'gemini-1.5-flash / gemini-2.0-flash',
    ocrAvailable: true,
  });
};

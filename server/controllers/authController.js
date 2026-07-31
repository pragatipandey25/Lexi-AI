const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ----------------------------------------------------------------
    // 1. Validate required fields
    // ----------------------------------------------------------------
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // ----------------------------------------------------------------
    // 2. Check if the email is already registered
    //    Using .select('+password') because the password field has
    //    select: false in the User model schema.
    // ----------------------------------------------------------------
    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ----------------------------------------------------------------
    // 3. Hash the password using bcrypt with 10 salt rounds
    // ----------------------------------------------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ----------------------------------------------------------------
    // 4. Create the user in MongoDB
    // ----------------------------------------------------------------
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ----------------------------------------------------------------
    // 5. Generate JWT token
    //    Payload contains userId and role.
    //    Secret comes from the environment variable JWT_SECRET.
    //    Token expires in 7 days.
    // ----------------------------------------------------------------
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ----------------------------------------------------------------
    // 6. Return success response (password is NOT exposed)
    // ----------------------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // ----------------------------------------------------------------
    // 7. Handle unexpected errors gracefully
    // ----------------------------------------------------------------
    console.error("Register User Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
};

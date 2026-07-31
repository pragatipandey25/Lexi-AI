const mongoose = require("mongoose");
const validator = require("validator");

/**
 * User Schema
 * Defines the structure of user documents in MongoDB.
 * Password hashing is handled in the authentication controller.
 */

const userSchema = new mongoose.Schema(
  {
    // Full Name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // Email Address
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },

    // Password (hashed)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError during development
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
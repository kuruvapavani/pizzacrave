const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long." });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({
          message:
            "Username can only contain letters, numbers, and underscores.",
        });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password,
      role: "user",
      verificationToken,
    });

    const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "🍕 Confirm Your Email - Welcome to PizzaCrave!",
      `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hi ${username},</h2>
      <p>Thank you for signing up with <strong>PizzaCrave</strong>!</p>
      <p>Before you can start ordering delicious pizzas, please verify your email by clicking the button below:</p>
      <p>
        <a 
          href="${verifyURL}" 
          style="display: inline-block; padding: 10px 20px; background-color: #FFA527; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify My Email
        </a>
      </p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <br />
      <p>Craving the best? We’ve got it hot and fresh — just for you. 🍕</p>
      <p>– The PizzaCrave Team</p>
    </div>
  `
    );

    res.status(201).json({
      message: "Please check your email to verify your account.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email to login." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const updateUsername = async (req, res) => {
  const { newUsername, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    user.username = newUsername;
    await user.save();

    res.json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update username", error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to change password", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified (token already consumed).",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(`[VERIFY EMAIL] Server error for token ${token}:`, error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      user.email,
      "Resend: Verify Your Email",
      `<p>Hello ${user.username},</p>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyURL}">Verify Email</a>`
    );

    res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({
      message: "Error resending verification email",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUsername,
  changePassword,
  getProfile,
  getRole,
  verifyEmail,
  resendVerificationEmail,
};

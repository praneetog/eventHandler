const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
  fullName: zod.string(),
  phone: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

//Signup
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  // Check for existing user by email or phone
  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (existingUser) {
    return res.json({
      status: "411",
      message:
        existingUser.email === req.body.email
          ? "Email already taken"
          : "Phone already taken",
    });
  }

  // Create a new user
  const user = await User.create({
    fullName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  });
  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
    fullName: user.fullName,
    userId: user._id,
  });
});

//Signin
const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
      fullName: user.fullName,
      userId: user._id,
      message: "Signed in",
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

//Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Fetch user data using the `userId` from the middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return user profile data
    res.json({
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Schema for update password request
const updatePasswordBody = zod.object({
  newPassword: zod
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

// Update Password Route
router.post("/update-password", authMiddleware, async (req, res) => {
  const { success, data, error } = updatePasswordBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input",
      error: error.errors,
    });
  }

  try {
    // Find the user using the `userId` from the middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the user's password
    user.password = data.newPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;

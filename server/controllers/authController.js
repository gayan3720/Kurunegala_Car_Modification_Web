import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res
      .status(201)
      .json({ result: 1, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ result: 0, message: err.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ result: 0, message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ result: 0, message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(token, "token");

    res.status(200).json({ result: 1, token, user });
  } catch (err) {
    res.status(500).json({ result: 0, message: err.message });
  }
};

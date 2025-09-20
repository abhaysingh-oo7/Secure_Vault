const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already registered" });

        // hash password
        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

        // generate random salt for vault key derivation
        const kdfSalt = crypto.randomBytes(16).toString("base64");

        // save user
        const user = await User.create({ email, passwordHash, kdfSalt });

        res
            .status(201)
            .json({ message: "User registered successfully", userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // verify password
        const validPassword = await argon2.verify(user.passwordHash, password);
        if (!validPassword)
            return res.status(400).json({ message: "Invalid credentials" });

        // create JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, kdfSalt: user.kdfSalt }); // send kdfSalt so client can derive encryption key
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

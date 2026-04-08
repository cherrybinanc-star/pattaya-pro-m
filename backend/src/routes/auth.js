const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/helpers");
const { authUser } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password required" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone },
      select: { id: true, email: true, name: true, phone: true, createdAt: true },
    });

    const token = generateToken(user.id, "user");
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user.id, "user");
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", authUser, async (req, res) => {
  const { password: _, ...user } = req.user;
  const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
  res.json({ ...user, addresses });
});

// PUT /api/auth/profile
router.put("/profile", authUser, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, avatar },
      select: { id: true, email: true, name: true, phone: true, avatar: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// POST /api/auth/address
router.post("/address", authUser, async (req, res) => {
  try {
    const { label, address, city, lat, lng, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }
    const addr = await prisma.address.create({
      data: { userId: req.user.id, label, address, city: city || "Pattaya", lat, lng, isDefault },
    });
    res.status(201).json(addr);
  } catch (err) {
    res.status(500).json({ error: "Failed to add address" });
  }
});

module.exports = router;

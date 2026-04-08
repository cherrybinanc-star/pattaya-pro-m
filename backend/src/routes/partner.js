const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/helpers");
const { authPartner } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/partner/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone, category, experience, idNumber } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password required" });
    }

    const exists = await prisma.partner.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // Find category
    let categoryConnect = undefined;
    if (category) {
      const cat = await prisma.category.findUnique({ where: { name: category } });
      if (cat) {
        categoryConnect = { create: [{ category: { connect: { id: cat.id } } }] };
      }
    }

    const partner = await prisma.partner.create({
      data: {
        email,
        password: hashed,
        name,
        phone,
        experience: experience ? parseInt(experience) : 0,
        idNumber,
        categories: categoryConnect,
        // Create default schedule
        schedules: {
          create: [
            { day: "Mon", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Tue", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Wed", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Thu", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Fri", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Sat", isActive: true, startTime: "10:00", endTime: "16:00" },
            { day: "Sun", isActive: false },
          ],
        },
        serviceAreas: {
          create: [{ area: "Central Pattaya" }],
        },
      },
      include: { categories: { include: { category: true } } },
    });

    const token = generateToken(partner.id, "partner");
    const { password: _, ...partnerData } = partner;
    res.status(201).json({ partner: partnerData, token });
  } catch (err) {
    console.error("Partner register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/partner/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await prisma.partner.findUnique({
      where: { email },
      include: {
        categories: { include: { category: true } },
        serviceAreas: true,
        schedules: true,
      },
    });
    if (!partner) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(partner.id, "partner");
    const { password: _, ...partnerData } = partner;
    res.json({ partner: partnerData, token });
  } catch (err) {
    console.error("Partner login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/partner/me
router.get("/me", authPartner, async (req, res) => {
  const partner = await prisma.partner.findUnique({
    where: { id: req.partner.id },
    include: {
      categories: { include: { category: true } },
      serviceAreas: true,
      schedules: { orderBy: { day: "asc" } },
    },
  });
  const { password: _, ...data } = partner;
  res.json(data);
});

// PUT /api/partner/profile
router.put("/profile", authPartner, async (req, res) => {
  try {
    const { name, phone, bio, avatar, bankName, bankAccount } = req.body;
    const partner = await prisma.partner.update({
      where: { id: req.partner.id },
      data: { name, phone, bio, avatar, bankName, bankAccount },
    });
    const { password: _, ...data } = partner;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// PUT /api/partner/online
router.put("/online", authPartner, async (req, res) => {
  const { isOnline } = req.body;
  const partner = await prisma.partner.update({
    where: { id: req.partner.id },
    data: { isOnline },
  });
  res.json({ isOnline: partner.isOnline });
});

// PUT /api/partner/schedule
router.put("/schedule", authPartner, async (req, res) => {
  try {
    const { schedules } = req.body; // [{day, isActive, startTime, endTime}]
    for (const s of schedules) {
      await prisma.partnerSchedule.upsert({
        where: { partnerId_day: { partnerId: req.partner.id, day: s.day } },
        update: { isActive: s.isActive, startTime: s.startTime, endTime: s.endTime },
        create: { partnerId: req.partner.id, ...s },
      });
    }
    const updated = await prisma.partnerSchedule.findMany({
      where: { partnerId: req.partner.id },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Schedule update failed" });
  }
});

// GET /api/partner/earnings
router.get("/earnings", authPartner, async (req, res) => {
  const earnings = await prisma.earning.findMany({
    where: { partnerId: req.partner.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  const totals = await prisma.earning.groupBy({
    by: ["type"],
    where: { partnerId: req.partner.id },
    _sum: { amount: true },
  });

  res.json({ earnings, totals });
});

// GET /api/partner/stats
router.get("/stats", authPartner, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayEarnings, weekEarnings, monthEarnings, totalBookings] = await Promise.all([
    prisma.earning.aggregate({ where: { partnerId: req.partner.id, date: { gte: today } }, _sum: { amount: true } }),
    prisma.earning.aggregate({ where: { partnerId: req.partner.id, date: { gte: weekAgo } }, _sum: { amount: true } }),
    prisma.earning.aggregate({ where: { partnerId: req.partner.id, date: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.booking.count({ where: { partnerId: req.partner.id } }),
  ]);

  res.json({
    today: todayEarnings._sum.amount || 0,
    week: weekEarnings._sum.amount || 0,
    month: monthEarnings._sum.amount || 0,
    totalBookings,
    rating: req.partner.rating,
    totalJobs: req.partner.totalJobs,
    totalEarnings: req.partner.totalEarnings,
  });
});

module.exports = router;

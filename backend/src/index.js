require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const partnerRoutes = require("./routes/partner");
const serviceRoutes = require("./routes/services");
const bookingRoutes = require("./routes/bookings");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ──────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CUSTOMER_URL || "http://localhost:3000",
    process.env.PARTNER_URL || "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
}));
app.use(express.json());

// ─── REQUEST LOGGING ────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// ─── ROUTES ─────────────────────────────────────────
app.use("/api/auth", authRoutes);         // Customer auth
app.use("/api/partner", partnerRoutes);   // Partner auth & management
app.use("/api/services", serviceRoutes);  // Services & categories
app.use("/api/bookings", bookingRoutes);  // Bookings (customer & partner)

// ─── HEALTH CHECK ───────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [userCount, partnerCount, serviceCount, bookingCount] = await Promise.all([
      prisma.user.count(),
      prisma.partner.count(),
      prisma.service.count(),
      prisma.booking.count(),
    ]);
    res.json({
      status: "ok",
      database: "connected",
      counts: { users: userCount, partners: partnerCount, services: serviceCount, bookings: bookingCount },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected", error: err.message });
  }
});

// ─── DASHBOARD STATS (public) ───────────────────────
app.get("/api/stats", async (req, res) => {
  const [users, partners, services, bookings] = await Promise.all([
    prisma.user.count(),
    prisma.partner.count({ where: { isVerified: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.booking.count({ where: { status: "completed" } }),
  ]);
  res.json({
    customers: users,
    providers: partners,
    services,
    completedBookings: bookings,
  });
});

// ─── 404 ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── ERROR HANDLER ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── START SERVER ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🌴 PattayaPro API Server                ║
║   Running on http://localhost:${PORT}        ║
║                                           ║
║   Routes:                                 ║
║   • /api/auth      → Customer Auth        ║
║   • /api/partner   → Partner Auth         ║
║   • /api/services  → Services & Catalog   ║
║   • /api/bookings  → Booking Management   ║
║   • /api/health    → Health Check         ║
║   • /api/stats     → Public Stats         ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

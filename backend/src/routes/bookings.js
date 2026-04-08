const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authUser, authPartner } = require("../middleware/auth");
const { generateBookingNo, calculateFees } = require("../utils/helpers");

const router = express.Router();
const prisma = new PrismaClient();

// ─── CUSTOMER ROUTES ────────────────────────────────

// POST /api/bookings - Create booking (customer)
router.post("/", authUser, async (req, res) => {
  try {
    const { serviceId, date, timeSlot, address, city, notes, lat, lng } = req.body;

    if (!serviceId || !date || !timeSlot || !address) {
      return res.status(400).json({ error: "Service, date, time and address required" });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    });
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Find best available partner
    const availablePartner = await prisma.partner.findFirst({
      where: {
        isActive: true,
        isVerified: true,
        isOnline: true,
        categories: { some: { categoryId: service.categoryId } },
      },
      orderBy: { rating: "desc" },
    });

    const fees = calculateFees(service.price);

    const booking = await prisma.booking.create({
      data: {
        bookingNo: generateBookingNo(),
        userId: req.user.id,
        partnerId: availablePartner?.id || null,
        serviceId,
        date: new Date(date),
        timeSlot,
        address,
        city: city || "Pattaya",
        lat,
        lng,
        notes,
        ...fees,
        status: availablePartner ? "confirmed" : "pending",
      },
      include: {
        service: { include: { category: true } },
        partner: { select: { id: true, name: true, phone: true, avatar: true, rating: true } },
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// GET /api/bookings - Get customer bookings
router.get("/", authUser, async (req, res) => {
  const { status } = req.query;

  const where = { userId: req.user.id };
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      service: { include: { category: true } },
      partner: { select: { id: true, name: true, phone: true, avatar: true, rating: true } },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(bookings);
});

// GET /api/bookings/:id
router.get("/:id", authUser, async (req, res) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      service: { include: { category: true } },
      partner: { select: { id: true, name: true, phone: true, avatar: true, rating: true, totalJobs: true } },
      review: true,
      payment: true,
    },
  });

  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

// PUT /api/bookings/:id/cancel (customer)
router.put("/:id/cancel", authUser, async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ error: "Cannot cancel this booking" });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "cancelled", cancelReason: req.body.reason || "Cancelled by customer" },
      include: { service: true, partner: { select: { name: true } } },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});

// POST /api/bookings/:id/review (customer)
router.post("/:id/review", authUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating 1-5 required" });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id, status: "completed" },
    });
    if (!booking) return res.status(404).json({ error: "Completed booking not found" });
    if (!booking.partnerId) return res.status(400).json({ error: "No partner assigned" });

    const existing = await prisma.review.findUnique({ where: { bookingId: booking.id } });
    if (existing) return res.status(400).json({ error: "Already reviewed" });

    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        userId: req.user.id,
        partnerId: booking.partnerId,
        rating,
        comment,
      },
    });

    // Update partner average rating
    const avgRating = await prisma.review.aggregate({
      where: { partnerId: booking.partnerId },
      _avg: { rating: true },
    });

    await prisma.partner.update({
      where: { id: booking.partnerId },
      data: { rating: Math.round((avgRating._avg.rating || 0) * 10) / 10 },
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Review failed" });
  }
});

// ─── PARTNER ROUTES ─────────────────────────────────

// GET /api/bookings/partner/jobs - Get partner's jobs
router.get("/partner/jobs", authPartner, async (req, res) => {
  const { status } = req.query;

  const where = { partnerId: req.partner.id };
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      service: { include: { category: true } },
      user: { select: { id: true, name: true, phone: true, avatar: true } },
      review: true,
    },
    orderBy: { date: "desc" },
  });

  res.json(bookings);
});

// GET /api/bookings/partner/new - Unassigned jobs for partner's categories
router.get("/partner/new", authPartner, async (req, res) => {
  const catIds = req.partner.categories.map((c) => c.categoryId);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "pending",
      partnerId: null,
      service: { categoryId: { in: catIds } },
    },
    include: {
      service: { include: { category: true } },
      user: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(bookings);
});

// PUT /api/bookings/partner/:id/accept
router.put("/partner/:id/accept", authPartner, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { partnerId: req.partner.id, status: "confirmed" },
      include: {
        service: true,
        user: { select: { name: true, phone: true, avatar: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Accept failed" });
  }
});

// PUT /api/bookings/partner/:id/start
router.put("/partner/:id/start", authPartner, async (req, res) => {
  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: "in_progress" },
  });
  res.json(updated);
});

// PUT /api/bookings/partner/:id/complete
router.put("/partner/:id/complete", authPartner, async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, partnerId: req.partner.id },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        paymentStatus: "paid",
      },
    });

    // Create earning record
    await prisma.earning.create({
      data: {
        partnerId: req.partner.id,
        amount: booking.price,
        type: "job",
        status: "paid",
        note: `Booking ${booking.bookingNo}`,
      },
    });

    // Update partner stats
    await prisma.partner.update({
      where: { id: req.partner.id },
      data: {
        totalJobs: { increment: 1 },
        totalEarnings: { increment: booking.price },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Complete failed" });
  }
});

// PUT /api/bookings/partner/:id/decline
router.put("/partner/:id/decline", authPartner, async (req, res) => {
  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { partnerId: null, status: "pending" },
  });
  res.json(updated);
});

module.exports = router;

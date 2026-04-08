const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services/categories
router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { services: true, partners: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  res.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameTh: c.nameTh,
      icon: c.icon,
      image: c.image,
      serviceCount: c._count.services,
      providerCount: c._count.partners,
    }))
  );
});

// GET /api/services/category/:id
router.get("/category/:id", async (req, res) => {
  const services = await prisma.service.findMany({
    where: { categoryId: req.params.id, isActive: true },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json(services);
});

// GET /api/services/popular
router.get("/popular", async (req, res) => {
  const services = await prisma.service.findMany({
    where: { isPopular: true, isActive: true },
    include: { category: true },
    take: 10,
  });
  res.json(services);
});

// GET /api/services/search?q=cleaning
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q } },
        { nameTh: { contains: q } },
        { description: { contains: q } },
      ],
    },
    include: { category: true },
  });
  res.json(services);
});

// GET /api/services/:id
router.get("/:id", async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!service) return res.status(404).json({ error: "Service not found" });

  // Get available providers for this service
  const providers = await prisma.partner.findMany({
    where: {
      isActive: true,
      isVerified: true,
      categories: {
        some: { categoryId: service.categoryId },
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      rating: true,
      totalJobs: true,
      isOnline: true,
      isVerified: true,
    },
    take: 5,
    orderBy: { rating: "desc" },
  });

  res.json({ ...service, providers });
});

// GET /api/services/providers/:categoryId
router.get("/providers/:categoryId", async (req, res) => {
  const providers = await prisma.partner.findMany({
    where: {
      isActive: true,
      isVerified: true,
      categories: {
        some: { categoryId: req.params.categoryId },
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      rating: true,
      totalJobs: true,
      isOnline: true,
      isVerified: true,
      experience: true,
      serviceAreas: true,
    },
    orderBy: { rating: "desc" },
  });
  res.json(providers);
});

module.exports = router;

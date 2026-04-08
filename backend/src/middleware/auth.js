const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Authenticate customer
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "user") return res.status(401).json({ error: "Invalid token type" });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.isActive) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Authenticate partner
const authPartner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "partner") return res.status(401).json({ error: "Invalid token type" });

    const partner = await prisma.partner.findUnique({
      where: { id: decoded.id },
      include: { categories: { include: { category: true } } },
    });
    if (!partner || !partner.isActive) return res.status(401).json({ error: "Partner not found" });

    req.partner = partner;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Authenticate admin
const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authUser, authPartner, authAdmin };

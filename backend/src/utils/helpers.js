const jwt = require("jsonwebtoken");

// Generate JWT token
function generateToken(id, type) {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Generate booking number
function generateBookingNo() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `BK-${date}-${rand}`;
}

// Calculate platform fee
function calculateFees(price) {
  const platformFee = 49;
  return {
    price,
    platformFee,
    totalAmount: price + platformFee,
  };
}

module.exports = { generateToken, generateBookingNo, calculateFees };

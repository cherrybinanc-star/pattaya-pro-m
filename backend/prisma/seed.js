const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PattayaPro database...\n");

  // ─── CATEGORIES ─────────────────────────────────
  const categories = [
    { name: "Cleaning", nameTh: "ทำความสะอาด", icon: "🧹", sortOrder: 1 },
    { name: "AC Service", nameTh: "แอร์", icon: "❄️", sortOrder: 2 },
    { name: "Plumbing", nameTh: "ประปา", icon: "🔧", sortOrder: 3 },
    { name: "Electrical", nameTh: "ไฟฟ้า", icon: "⚡", sortOrder: 4 },
    { name: "Beauty", nameTh: "ความสวยงาม", icon: "💅", sortOrder: 5 },
    { name: "Massage", nameTh: "นวด", icon: "💆", sortOrder: 6 },
    { name: "Laundry", nameTh: "ซักรีด", icon: "👔", sortOrder: 7 },
    { name: "Pest Control", nameTh: "กำจัดแมลง", icon: "🐛", sortOrder: 8 },
    { name: "Pool Service", nameTh: "สระว่ายน้ำ", icon: "🏊", sortOrder: 9 },
    { name: "Gardening", nameTh: "จัดสวน", icon: "🌿", sortOrder: 10 },
    { name: "Painting", nameTh: "ทาสี", icon: "🎨", sortOrder: 11 },
    { name: "Moving", nameTh: "ย้ายของ", icon: "📦", sortOrder: 12 },
  ];

  const createdCats = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
    createdCats[cat.name] = created.id;
    console.log(`  ✅ Category: ${cat.icon} ${cat.name}`);
  }

  // ─── SERVICES ───────────────────────────────────
  const services = [
    // Cleaning
    { categoryId: createdCats["Cleaning"], name: "Deep Home Cleaning", icon: "🏠", price: 1500, duration: "3-4h", isPopular: true },
    { categoryId: createdCats["Cleaning"], name: "Condo Cleaning", icon: "🏢", price: 800, duration: "2h" },
    { categoryId: createdCats["Cleaning"], name: "Move-in/Move-out Clean", icon: "📦", price: 2500, duration: "5-6h", isPopular: true },
    { categoryId: createdCats["Cleaning"], name: "Kitchen Deep Clean", icon: "🍳", price: 1200, duration: "2-3h" },
    { categoryId: createdCats["Cleaning"], name: "Bathroom Sanitization", icon: "🚿", price: 600, duration: "1-2h" },
    // AC
    { categoryId: createdCats["AC Service"], name: "AC Clean & Service", icon: "❄️", price: 500, duration: "1h", isPopular: true },
    { categoryId: createdCats["AC Service"], name: "AC Installation", icon: "🔩", price: 2000, duration: "2-3h" },
    { categoryId: createdCats["AC Service"], name: "AC Repair", icon: "🔧", price: 800, duration: "1-2h" },
    { categoryId: createdCats["AC Service"], name: "Gas Refill", icon: "💨", price: 1200, duration: "1h" },
    // Plumbing
    { categoryId: createdCats["Plumbing"], name: "Leak Repair", icon: "💧", price: 600, duration: "1-2h" },
    { categoryId: createdCats["Plumbing"], name: "Drain Cleaning", icon: "🚰", price: 500, duration: "1h", isPopular: true },
    { categoryId: createdCats["Plumbing"], name: "Pipe Installation", icon: "🔧", price: 1500, duration: "3-4h" },
    // Electrical
    { categoryId: createdCats["Electrical"], name: "Wiring & Repair", icon: "🔌", price: 800, duration: "1-2h" },
    { categoryId: createdCats["Electrical"], name: "Light Installation", icon: "💡", price: 400, duration: "1h", isPopular: true },
    { categoryId: createdCats["Electrical"], name: "Electrical Inspection", icon: "📋", price: 1000, duration: "2h" },
    // Beauty
    { categoryId: createdCats["Beauty"], name: "Hair Styling at Home", icon: "💇", price: 800, duration: "1-2h", isPopular: true },
    { categoryId: createdCats["Beauty"], name: "Manicure & Pedicure", icon: "💅", price: 600, duration: "1.5h" },
    { categoryId: createdCats["Beauty"], name: "Facial Treatment", icon: "✨", price: 1500, duration: "1h", isPopular: true },
    { categoryId: createdCats["Beauty"], name: "Makeup Artist", icon: "💄", price: 2000, duration: "1-2h" },
    // Massage
    { categoryId: createdCats["Massage"], name: "Thai Traditional Massage", icon: "🙏", price: 500, duration: "1h", isPopular: true },
    { categoryId: createdCats["Massage"], name: "Oil Massage", icon: "🫧", price: 700, duration: "1h" },
    { categoryId: createdCats["Massage"], name: "Foot Reflexology", icon: "🦶", price: 400, duration: "1h" },
    { categoryId: createdCats["Massage"], name: "Couple Massage", icon: "💑", price: 1200, duration: "1.5h", isPopular: true },
    // Pool
    { categoryId: createdCats["Pool Service"], name: "Pool Cleaning", icon: "🏊", price: 1500, duration: "2-3h", isPopular: true },
    { categoryId: createdCats["Pool Service"], name: "Chemical Balance", icon: "🧪", price: 800, duration: "1h" },
    // Garden
    { categoryId: createdCats["Gardening"], name: "Garden Maintenance", icon: "🌿", price: 1000, duration: "2-3h", isPopular: true },
    { categoryId: createdCats["Gardening"], name: "Tree Trimming", icon: "🌳", price: 800, duration: "2h" },
    // Pest
    { categoryId: createdCats["Pest Control"], name: "General Pest Control", icon: "🐛", price: 1500, duration: "2h", isPopular: true },
    { categoryId: createdCats["Pest Control"], name: "Termite Treatment", icon: "🏠", price: 3000, duration: "3-4h" },
    // Painting
    { categoryId: createdCats["Painting"], name: "Room Painting", icon: "🎨", price: 3000, duration: "1-2 days", isPopular: true },
    // Moving
    { categoryId: createdCats["Moving"], name: "Local Moving", icon: "🚛", price: 3000, duration: "3-5h", isPopular: true },
    { categoryId: createdCats["Moving"], name: "Packing Service", icon: "📦", price: 1500, duration: "2-3h" },
  ];

  for (const svc of services) {
    await prisma.service.create({ data: svc });
  }
  console.log(`\n  ✅ Created ${services.length} services`);

  // ─── TEST USERS ─────────────────────────────────
  const hashedPass = await bcrypt.hash("password123", 10);
  const adminPass = await bcrypt.hash("admin123", 10);

  const customer = await prisma.user.upsert({
    where: { email: "cherry@test.com" },
    update: {},
    create: {
      email: "cherry@test.com",
      password: hashedPass,
      name: "Cherry",
      phone: "+66 89 123 4567",
      city: "Pattaya",
      addresses: {
        create: [
          { label: "Home", address: "123 Pratumnak Soi 5, Pattaya", city: "Pattaya", isDefault: true },
          { label: "Office", address: "456 Central Pattaya Rd", city: "Pattaya" },
        ],
      },
    },
  });
  console.log(`\n  👤 Customer: cherry@test.com / password123`);

  const customer2 = await prisma.user.upsert({
    where: { email: "anna@test.com" },
    update: {},
    create: {
      email: "anna@test.com",
      password: hashedPass,
      name: "Anna M.",
      phone: "+66 91 234 5678",
      city: "Pattaya",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@pattayapro.com" },
    update: {},
    create: {
      email: "admin@pattayapro.com",
      password: adminPass,
      name: "PattayaPro Admin",
      role: "admin",
    },
  });
  console.log(`  🔑 Admin: admin@pattayapro.com / admin123`);

  // ─── TEST PARTNERS ──────────────────────────────
  const partners = [
    { email: "somchai@test.com", name: "Somchai K.", phone: "+66 82 111 2222", experience: 8, isVerified: true, isOnline: true, rating: 4.9, totalJobs: 342, totalEarnings: 456000, categories: ["AC Service", "Electrical"] },
    { email: "noi@test.com", name: "Noi P.", phone: "+66 83 222 3333", experience: 5, isVerified: true, isOnline: true, rating: 4.8, totalJobs: 567, totalEarnings: 380000, categories: ["Cleaning"] },
    { email: "kwan@test.com", name: "Kwan M.", phone: "+66 84 333 4444", experience: 10, isVerified: true, isOnline: false, rating: 4.9, totalJobs: 891, totalEarnings: 720000, categories: ["Massage", "Beauty"] },
    { email: "chai@test.com", name: "Chai R.", phone: "+66 85 444 5555", experience: 6, isVerified: true, isOnline: true, rating: 4.7, totalJobs: 234, totalEarnings: 280000, categories: ["Plumbing"] },
    { email: "ploy@test.com", name: "Ploy S.", phone: "+66 86 555 6666", experience: 4, isVerified: true, isOnline: true, rating: 4.9, totalJobs: 456, totalEarnings: 520000, categories: ["Beauty", "Massage"] },
  ];

  for (const p of partners) {
    const { categories: cats, ...partnerData } = p;
    const created = await prisma.partner.upsert({
      where: { email: p.email },
      update: {},
      create: {
        ...partnerData,
        password: hashedPass,
        bio: `Professional ${cats.join(" & ")} service provider in Pattaya`,
        bankName: "Kasikorn Bank",
        bankAccount: "xxx-x-xxxxx-x",
        categories: {
          create: cats.map((catName) => ({
            category: { connect: { name: catName } },
          })),
        },
        serviceAreas: {
          create: [
            { area: "Central Pattaya" },
            { area: "Jomtien" },
            { area: "Pratumnak" },
          ],
        },
        schedules: {
          create: [
            { day: "Mon", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Tue", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Wed", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Thu", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Fri", isActive: true, startTime: "09:00", endTime: "18:00" },
            { day: "Sat", isActive: true, startTime: "10:00", endTime: "16:00" },
            { day: "Sun", isActive: false, startTime: null, endTime: null },
          ],
        },
      },
    });
    console.log(`  🔧 Partner: ${p.email} / password123`);
  }

  // ─── SAMPLE BOOKINGS ────────────────────────────
  const allServices = await prisma.service.findMany();
  const allPartners = await prisma.partner.findMany();

  const bookings = [
    {
      bookingNo: "BK-20260408-001",
      userId: customer.id,
      partnerId: allPartners[0].id,
      serviceId: allServices.find((s) => s.name === "AC Clean & Service").id,
      status: "confirmed",
      date: new Date("2026-04-08"),
      timeSlot: "10:00 AM",
      address: "123 Pratumnak Soi 5, Pattaya",
      price: 500,
      platformFee: 49,
      totalAmount: 549,
    },
    {
      bookingNo: "BK-20260412-002",
      userId: customer.id,
      partnerId: allPartners[1].id,
      serviceId: allServices.find((s) => s.name === "Deep Home Cleaning").id,
      status: "pending",
      date: new Date("2026-04-12"),
      timeSlot: "9:00 AM",
      address: "123 Pratumnak Soi 5, Pattaya",
      price: 1500,
      platformFee: 49,
      totalAmount: 1549,
    },
    {
      bookingNo: "BK-20260405-003",
      userId: customer.id,
      partnerId: allPartners[0].id,
      serviceId: allServices.find((s) => s.name === "AC Repair").id,
      status: "completed",
      date: new Date("2026-04-05"),
      timeSlot: "2:00 PM",
      address: "456 Central Pattaya Rd",
      price: 800,
      platformFee: 49,
      totalAmount: 849,
      paymentStatus: "paid",
      completedAt: new Date("2026-04-05T16:00:00"),
    },
  ];

  for (const b of bookings) {
    await prisma.booking.create({ data: b });
  }
  console.log(`\n  📋 Created ${bookings.length} sample bookings`);

  // ─── SAMPLE EARNINGS ────────────────────────────
  for (const p of allPartners) {
    const earningData = [
      { partnerId: p.id, amount: 1800, type: "job", status: "paid", date: new Date("2026-04-01") },
      { partnerId: p.id, amount: 2200, type: "job", status: "paid", date: new Date("2026-04-02") },
      { partnerId: p.id, amount: 1500, type: "job", status: "paid", date: new Date("2026-04-03") },
      { partnerId: p.id, amount: 2800, type: "job", status: "paid", date: new Date("2026-04-04") },
      { partnerId: p.id, amount: 3200, type: "job", status: "paid", date: new Date("2026-04-05") },
      { partnerId: p.id, amount: 500, type: "bonus", status: "paid", note: "Weekly bonus", date: new Date("2026-04-06") },
    ];
    await prisma.earning.createMany({ data: earningData });
  }
  console.log(`  💰 Created sample earnings for all partners`);

  console.log("\n✅ Database seeded successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

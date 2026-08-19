const { PrismaClient } = require("../lib/prisma/generated");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function seed() {
  const email = "test@admin.local";
  const password = "TestPass123!";
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  await prisma.user.upsert({
    where: { email },
    update: { name: "Test Admin", password: hash },
    create: { name: "Test Admin", email, password: hash },
  });

  console.log("Seeded test user:", email);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

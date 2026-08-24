import "dotenv/config";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@prisma/client";

import argon2 from "argon2";


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}


const pool = new Pool({
  connectionString
});


const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({
  adapter
});


async function main() {

  console.log("🌱 Starting database seed...");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be defined"
    );
  }


  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrator"
    }
  });

  const existingAdmin =
    await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });


  if (existingAdmin) {
    console.log(
      `Admin ${email} already exists`
    );

    return;
  }


  const passwordHash =
    await argon2.hash(password);


  const admin =
    await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME || "System Admin",
        email: email.toLowerCase(),
        passwordHash,
        roleId: adminRole.id,
        isActive: true
      }
    });


  console.log(
    `✅ Admin created: ${admin.email}`
  );
}


main()
  .catch((error) => {

    console.error(
      "❌ Seed failed:",
      error
    );

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

    await pool.end();

  });
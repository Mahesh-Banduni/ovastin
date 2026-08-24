import "dotenv/config";

import {
  PrismaPg
} from "@prisma/adapter-pg";
import {
  PrismaClient
} from "@prisma/client";

import config from "../config/config.js";

const adapter = new PrismaPg({
  connectionString: config.databaseUrl
});

const prisma = new PrismaClient({
  adapter
});

export default prisma;

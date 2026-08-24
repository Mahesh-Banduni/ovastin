import "dotenv/config";

import { injectable } from "inversify";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import config from "../config/config";

@injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = config.databaseUrl;

    /*
     * Fail fast with a clear message instead of letting pg fall
     * back to localhost defaults when DATABASE_URL is missing.
     */
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Check your .env file and dotenv loading."
      );
    }

    super({
      adapter: new PrismaPg({ connectionString })
    });
  }

  async connect(): Promise<void> {
    await this.$connect();
  }

  async disconnect(): Promise<void> {
    await this.$disconnect();
  }
}
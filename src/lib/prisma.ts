import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Neon's serverless driver needs a WebSocket implementation in Node.js.
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  // Use the Neon serverless adapter so connections survive Neon's pooler
  // closing idle sockets (fixes Prisma error P1017 "Server has closed the connection").
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

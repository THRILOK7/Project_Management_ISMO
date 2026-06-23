"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = `${process.env.DATABASE_URL}`;
// Global singleton pattern to prevent multiple instances
const globalForPrisma = global;
// Reuse existing pool and prisma client across hot reloads
if (!globalForPrisma.pool) {
    globalForPrisma.pool = new pg_1.Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 20, // Maximum pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}
if (!globalForPrisma.prisma) {
    const adapter = new adapter_pg_1.PrismaPg(globalForPrisma.pool);
    globalForPrisma.prisma = new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}
const prisma = globalForPrisma.prisma;
exports.default = prisma;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("./generated/prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
// Test the database connection
prisma.$connect()
    .then(() => {
    console.log('Successfully connected to the database');
})
    .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});


import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

// Test the database connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });

export { prisma };
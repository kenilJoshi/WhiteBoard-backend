import { PrismaClient } from "@prisma/client";

const prisma = (globalThis as any).prisma || new PrismaClient()

export default prisma
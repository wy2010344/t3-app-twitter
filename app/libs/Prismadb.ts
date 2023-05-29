

import { PrismaClient } from "@prisma/client";
import { env } from "process";


declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({
  log: env.NODE_ENV == 'development' ? ['query', 'error', 'warn'] : ['error']
})
if (env.NODE_ENV != 'production') {
  globalThis.prisma = prisma
}

export default prisma
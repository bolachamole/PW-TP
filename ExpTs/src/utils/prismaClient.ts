import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaAdapter } from "@prisma/adapter-mariadb";
import validateEnv from "../utils/validateEnv.js";

const env = validateEnv();
// acessa o bd
const adapter = PrismaMariaDb(env.DATABSE_URL);
// instancia do prisma pra ajudar no acesso
const prisma = new PrismaClient({ adapter });

export default { prisma }

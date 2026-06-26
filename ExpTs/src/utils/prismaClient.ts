import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import validateEnv from "../utils/validateEnv.js";

const env = validateEnv();
// acessa o bd
const adapter = new PrismaMariaDb(env.DATABASE_URL);
// instancia do prisma pra ajudar no acesso
const prisma = new PrismaClient({ adapter });

export default prisma

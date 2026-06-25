import { genSalt, hash, compare } from "bcryptjs";
import type { User } from "../generated/prisma/client.js";
import type { SignUpDto } from "../types/auth.js";
import prisma from "../utils/prismaClient.js";
import validateEnv from "../utils/validateEnv.js";

const env = validateEnv();

export async function createUser(data: SignUpDto): Promise<User>{
	const salt = await genSalt(env.BCRYPT_ROUNDS);
	const password = await hash(data.passwords, salt);
	return prisma.user.create({ data });
}

export async function checkCredentials(data: LogInDto): Promise<null | User>{
	const user = await primsa.user.findFirst({
		where: {
			email: data.email,
		}
	});
	const ok = await compare(data.password, user ? user.password : "FAKEHASH");
	if (!ok) return null;
	return user;
}

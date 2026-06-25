import type { User } from "../generated/prisma/client.js";

export type SignUpDto = Pick<User, "name" | "email" | "password" | "majorId">;
export type LogInDto = Pick<User, "email" | "password">;

import type { Major } from "../generated/prisma/client.js";
import type { CreateMajorDto, UpdateMajorDto } from "../types/major.js";
import prisma from "../utils/prismaClient.js";

export async function getMajors(): Promise<Major[]> {
	return prisma.major.findMany();
}

export async function getMajor(id: string): Promise<Major | null> {
	return prisma.major.findFirst({ where: {id} });
}

export async function createMajor(data: CreateMajorDto): Promise<Major> {
	return prisma.major.create({ data });
}

export async function updateMajor(id: string, data: UpdateMajorDto): Promise<Major> {
	return prisma.major.update({ data: data, where: {id} });
}

export async function removeMajor(id: string): Promise<Major | null> {
	return prisma.major.delete({ where: {id} });
}

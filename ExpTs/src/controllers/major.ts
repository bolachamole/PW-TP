import type { Request, Response } from "express";
import type { CreateMajorDto, UpdateMajorDto } from "../types/major.js";
import { getMajors, createMajor, getMajor, updateMajor, removeMajor } from "../services/major.js";

const index = async (_req: Request, res: Response) => {
	const majors = await getMajors();
	res.render("major/index", { majors });
}
const create = async (req: Request, res: Response) => {
	if (req.method === "GET") {
		res.render("major/create");
	} else if (req.method === "POST") {
		const major = req.body as CreateMajorDto;
		console.log("Body:", req.body);
		try {
			await createMajor(major);
			res.status(200).json({ redirect: "/major" });
		} catch (erro) {
			console.error("Erro ao criar major:", erro);
			res.status(500).json({ error: "Erro ao criar major" });
		}
	}
}
const read = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const major = await getMajor(id);
		if (major){
			res.render("major/read", {
				major,
				hasDescription: major && major.description
			})
		}
	} catch (erro) {
		res.status(500).send();
	}
}
const update = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	if (req.method === "GET") {
		const major = await getMajor(id);
		res.render("major/update", { major });
	} else if (req.method === "POST") {
		const major = req.body as UpdateMajorDto;
		try {
			await updateMajor(id, major);
			res.status(200).json({ redirect: `/major/read/${id}` });
		} catch (erro) {
			console.error("Erro ao atualizar major:", erro);
			res.status(500).json({ error: "Erro ao atualizar major" });
		}
	}
}
const remove = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const major = await removeMajor(id);
		res.send(major);
	} catch (erro) {
		res.status(500).send();
	}
}

export default { index, read, create, update, remove }

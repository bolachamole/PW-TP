import type { Request, Response } from "express";
import type { CreateMajorDto, UpdateMajorDto } from "../types/major.js";
import { getMajors, createMajor, getMajor, updateMajor, removeMajor } from "../services/major.js";

const index = async (req: Request, res: Response) => {
	const majors = await getMajors();
	res.render("majors/index", { majors });
}
const create = async (req: Request, res: Response) => {
	if (req.method === "GET"){
		res.render("major/create");
	} else if(req.method === "POST") {
		const major = req.body as CreateMajorDto;
		try {
			await createMajor(major);
			res.redirect("/majors");
		} catch(erro){
			res.status(500).send;
		}
	}
}
const read = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const major = await getMajor(id);
		res.render("major/read", {
			major,
			hasDescription: major && major.description
		})
	} catch(erro){
		res.status(500).send;
	}
}
const update = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	if (req.method === "GET"){
		const major = await getMajor(id);
		res.render("major/update", { major });
	} else if(req.method === "POST") {
		const major = req.body as UpdateMajorDto;
		try {
			await updateMajor(id, major);
			res.redirect(`/majors/read/${id}`);
		} catch(erro){
			res.status(500).send;
		}
	}
}
const remove = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try{
		const major = await removeMajor(id);
		if (!major) return res.status(400).send;
		res.send(major);
	} catch(erro){
		res.status(500).send;
	}
}

export default { index, read, create, update, remove }

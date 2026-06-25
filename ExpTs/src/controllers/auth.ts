import type { Request, Response } from "express";
import type { SignUpDto, LogInDto } from "../types/auth.js";
import { createUser, checkCredentials } from "../services/auth.js";

const signup = (req: Request, res: Response) =>{
	if (req.method === "GET"){
		res.render("auth/signup", { majors });
	} else if (req.method === "POST"){
		const data = req.body as SignUpDto;
		try {
			const user = await createUser(data);
		} catch(erro){
			res.status(500).send()
		}
	}
}
const login = (req: Request, res: Response) =>{
	if (req.method === "GET"){
		res.render("auth/login");
	} else if (req.method === "POST"){
		const data = req.body as LogInDto;
		try {
			const user = await checkCredentials(data);
			if (user){
				req.session.uid = user.id;
				res.redirect("/jogo");
			} else {
				res.redirect("/login");
			}
		} catch(erro){
			res.status(500).send()
		}
	}
}
const logout = (req: Request, res: Response) =>{
	req.session.destroy((erro) => {
		if (erro){
			console.error(erro);
			res.status(500).send()
		}
		res.redirect("/login");
	});
}

export default { signup, login, logout }

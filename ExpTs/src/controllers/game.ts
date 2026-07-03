import type { Request, Response } from "express";
import { getRanking } from "../services/game.js";

const play = (_req: Request, res: Response) => {
	res.render("game/play");
}

const ranking = async (_req: Request, res: Response) => {
	const rankings = await getRanking();
	res.render("game/ranking", { rankings });
}

export default { play, ranking };

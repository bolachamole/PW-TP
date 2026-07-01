import type { Request, Response } from "express";

const play = (_req: Request, res: Response) => {
	res.render("game/play");
}

const ranking = (_req: Request, res: Response) => {
	res.render("game/ranking");
}

export default { play, ranking };

import type { Request, Response } from "express";

const play = (req: Request, res: Response) => {
	res.render("game/play");
}

export default { play };

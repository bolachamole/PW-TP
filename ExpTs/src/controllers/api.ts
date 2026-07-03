import type { Request, Response } from "express";
import { saveScore } from "../services/game.js";

const submitScore = async (req: Request, res: Response) => {
  if (!req.session.uid) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  const { score } = req.body;
  if (typeof score !== "number" || score < 0) {
    res.status(400).json({ error: "Score inválido" });
    return;
  }
  try {
    await saveScore(req.session.uid, score);
    res.json({ ok: true });
  } catch (erro) {
    console.error("Erro ao salvar score:", erro);
    res.status(500).json({ error: "Erro ao salvar score" });
  }
};

export default { submitScore };

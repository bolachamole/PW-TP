import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.uid) {
    res.redirect("/login");
    return;
  }
  next();
}

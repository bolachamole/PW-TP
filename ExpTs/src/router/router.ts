import { Router } from 'express';
import main from '../controllers/main.js';
import majorController from "../controllers/major.js"
import authController from "../controllers/auth.js"
import gameController from "../controllers/game.js";
import apiController from "../controllers/api.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/', main.index);
router.get("/about", main.about);
router.get("/lorem/:id", main.lorem);
router.get("/hb1", main.hb1);
router.get("/hb2", main.hb2);
router.get("/hb3", main.hb3);
router.get("/hb4", main.hb4);

router.all("/signup", authController.signup);
router.all("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/play", requireAuth, gameController.play);
router.get("/ranking", requireAuth, gameController.ranking);
router.post("/api/score", requireAuth, apiController.submitScore);

router.get("/major", majorController.index);
router.all("/major/create", majorController.create);
router.get("/major/read/:id", majorController.read);
router.all("/major/update/:id", majorController.update);
router.post("/major/remove/:id", majorController.remove);

export default router;

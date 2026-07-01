import express from "express";
import morgan from "morgan";
import router from "./router/router.js";
import validateEnv from "./utils/validateEnv.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { engine } from "express-handlebars";
import { logger } from "./middlewares/logger.js";
import { listCredits, listIntegrantes, listProfs, listTechs } from "./helpers/helpers.js";
import { v4 as uuidv4 } from "uuid";

const env = validateEnv();

declare module "express-session" {
	interface SessionData {
		uid: string;
	}
}

const app = express();
const PORT = env.PORT;
const publicPath = `${process.cwd()}/public`;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	name: "sid",
	genid: () => uuidv4(),
	secret: env.SECRET,
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		httpOnly: true,
		maxAge: 2 * 60 * 60 * 1000
	}
}));
app.use((req, res, next) => {
	res.locals.logado = !!req.session.uid;
	next();
});
app.use(morgan("short"));
app.use(logger("completo"));
app.use(router);

app.engine("handlebars", engine({
	partialsDir: "src/views/partials",
	helpers: {
		listProfs,
		listTechs,
		listIntegrantes,
		listCredits
	}
}));
app.set("view engine", "handlebars");
app.set("views", "src/views");

app.use('/css', express.static(`${publicPath}/css`));
app.use('/js', express.static(`${publicPath}/js`));
app.use('/img', express.static(`${publicPath}/img`));

app.listen(PORT, () => {
	console.log(`Express app iniciada na porta ${PORT}.`);
});

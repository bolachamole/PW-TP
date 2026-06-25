import fs from "fs";
import dotenv from "dotenv";
import validateEnv from "../utils/validateEnv.js";
import type { Request, Response, NextFunction } from 'express';

dotenv.config();
validateEnv();

export const logger = (formato: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const pastaLogs = process.env.LOGS_PATH || './logs';
        
        if (!fs.existsSync(pastaLogs)) {
            fs.mkdirSync(pastaLogs, { recursive: true });
        }

        const data = new Date().toISOString();
        const url = req.url;
        const metodo = req.method;

        let linhaLog = '';
        if (formato == "simples") {
            linhaLog = `[${data}] ${metodo} ${url}\n`;
        }
        else if (formato === "completo") {
            linhaLog = `[${data}] ${metodo} ${url} HTTP/${req.httpVersion} - UA: ${req.headers['user-agent']}\n`;
        }

        fs.appendFile(`${pastaLogs}/log.log`, linhaLog, (erro) => {
            if (erro) {
                console.error(erro);
            }
        });

        next();
    };
};
import { cleanEnv, num, port, str } from 'envalid';
import dotenv from "dotenv";

dotenv.config();
const validateEnv = () => {
    return cleanEnv(process.env, {
        PORT: port(),
        LOGS_PATH: str(),
        DATABASE_URL: str(),
        SECRET: str(),
        BCRYPT_ROUNDS: num()
    });
};

export default validateEnv;

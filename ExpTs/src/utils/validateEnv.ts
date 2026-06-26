import { cleanEnv, num, port, str } from 'envalid';

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
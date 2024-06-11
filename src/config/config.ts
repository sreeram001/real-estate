import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  Jwtkey: string;
  dbUserName: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  Jwtkey: process.env.JWT_SECRET_KEY || "",
  dbUserName: process.env.DB_USER_NAME || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbHost: process.env.DB_HOST || "",
  dbPort: parseInt(process.env.DB_PORT || '0', 10),
};

export default config;



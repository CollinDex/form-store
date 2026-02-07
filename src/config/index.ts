import dotenv from 'dotenv';
dotenv.config();

const config = {
	port: process.env.PORT ?? 8000,
	'api-prefix': 'api/v1',
	DB_USER: process.env.DB_USER,
	DB_HOST: process.env.DB_HOST,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.DB_NAME,
	TOKEN_SECRET: process.env.AUTH_SECRET,
	TOKEN_EXPIRY: process.env.AUTH_EXPIRY,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT || 6379,
	NODE_ENV: process.env.NODE_ENV,
	BASE_URL: process.env.BASE_URL
};

export default config;

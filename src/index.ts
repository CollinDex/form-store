import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import config from './config';
import log from './utils/logger';
import AppDataSource from './data-source';
import './queues/email.queue';

dotenv.config();

const port = config.port;

const startServer = async () => {
	try {
		await AppDataSource.initialize();
		log.info('📦 Database connected successfully');

		app.listen(port, () => {
			log.info(`🚀 Server running on http://localhost:${port}`);
			log.info(`📨 Email Worker is active and listening to Redis...`);
		});
	} catch (error) {
		log.error('❌ Error starting server:', error);
		process.exit(1);
	}
};

startServer();

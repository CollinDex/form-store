import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import config from './config';
import log from './utils/logger';
import AppDataSource from './data-source';

dotenv.config();

const port = config.port;

// Initialize Postgres Data Source and Start Server
AppDataSource.initialize()
	.then(() => {
		app.listen(port, () => {
			log.info(`Server is listening on port ${port}`);
		});
	})
	.catch((error) => {
		log.error('Error initializing Database connection:', error);
		process.exit(1); // Exit the process if conection fails
	});

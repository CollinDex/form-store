import swaggerJsdoc, { SwaggerDefinition } from 'swagger-jsdoc';
import config from '.';
import { version } from '../../package.json';

const swaggerDefinition: SwaggerDefinition = {
	openapi: '3.1.0',
	info: {
		title: 'Express Template',
		version: version,
		description: 'OpenApi documentaiton for the Form ApI'
	},
	servers: [
		{
			url: `http://localhost:${config.port}/api/v1`,
			description: 'Local server'
		},
		{
			url: 'https://express-template-production.up.railway.app/',
			description: 'Live server'
		}
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	},
	security: [
		{
			bearerAuth: []
		}
	]
};

const options = {
	swaggerDefinition,
	apis: ['./src/docs/swagger.ts']
};

const specs = swaggerJsdoc(options);

export default specs;

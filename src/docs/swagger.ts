/**
 *
 * Swagger config
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */

import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'

/**
 * Config swagger jsdoc
 *
 */
const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
	openapi: '3.0.1',
	info: {
		title: 'Tictactoe',
		version: '1.0.1',
		description: 'Tictactoe documentation',
	},
	tags: [
		{
			name: 'Game',
			description: 'Game endpoints',
		},
	],
}

const options = {
	swaggerDefinition,
	apis: ['./src/resources/**/*.router.ts', './src/docs/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

export default {
	serve: swaggerUi.serve,
	setup: swaggerUi.setup(swaggerSpec),
}

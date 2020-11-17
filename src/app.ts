import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser' // pull information from HTML POST (express4)
import * as cors from 'cors' // Allow cors// log requests to the console (express4)
import * as express from 'express' // framework
import * as helmet from 'helmet' // Security
import * as methodOverride from 'method-override' // simulate DELETE and PUT (express4)
import * as morgan from 'morgan' // log requests to the console (express4)
import {router} from './resources'
import * as swaggerUi from 'swagger-ui-express'
import * as YAML from 'yamljs'
import * as path from 'path'
// Doc
import {errorHandler} from './middlewares/errorHandler'
import {morganStream} from './utils/logger'

dotenv.config()

/**
 * Setting environment for development|production
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Setting port number
 */
process.env.PORT = process.env.PORT || '3000'

/**
 * Create our app w/ express
 */
const app: express.Application = express()

/**
 * Env
 */
/**
 * HELMET
 */
app.use(helmet())
/**
 * CORS
 */
app.use(cors())
app.options('*', cors())

/**
 * LOGGING
 */
app.use(morgan('combined', {stream: morganStream}))

/**
 * Body parsers and methods
 */
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50MB',
	}),
) // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50MB'})) // parse application/json
app.use(methodOverride())

/**
 * Router
 */
app.use('/api/v1/games', router.gameRouter)
/**
 * Swagger Documentation
 */
const swaggerSpec = YAML.load(path.join(__dirname + '/docs/swagger.yaml'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

/**
 * Setting routes
 */

export default app

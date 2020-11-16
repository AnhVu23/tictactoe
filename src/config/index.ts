/**
 * Database config
 *
 * @author Anh Vu <anh.vu@vertics.co>
 *
 * @copyright Vertics Oy 2020
 */
import * as _ from 'lodash'
import devConfig from './devConfig'
import prodConfig from './prodConfig'

const env = process.env.NODE_ENV || 'development'

const baseConfig = {
	env,
	isDev: env === 'development',
	isProd: env === 'production',
	port: process.env.PORT || 3000,
	requestLimiter: {
		timeLimit: 15 * 60 * 1000, // 15 minutes
		amountLimit: 100, // limit each IP to 100 requests per windowMs
	},
}

let envConfig

switch (env) {
	case 'development':
		envConfig = devConfig
		break

	case 'production':
		envConfig = prodConfig
		break

	default:
		envConfig = devConfig
}

const config = _.merge(baseConfig, envConfig)

export default config

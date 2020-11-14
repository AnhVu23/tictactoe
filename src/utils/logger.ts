/**
 *
 * Winston logger
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import * as _ from 'lodash'
import {StreamOptions} from 'morgan'
import {createLogger, format, Logger, transports} from 'winston'
import config from '../config'
const {printf} = format

const myFormat = printf(({level, message, label, timestamp}) => {
	return `${timestamp} [${label}] ${level}: ${message}`
})

const exceptionFormat = printf(({level, message, label, timestamp}) => {
	return `${timestamp} [${label}] ${level}: ${message}`
})

const initLogger = (module: NodeModule | string): Logger => {
	let path: string
	if (typeof module === 'string') {
		path = module
	} else {
		const regex = /\/|\\/i
		path = _.last(module.filename.split(regex))
	}
	return createLogger({
		level: config.loggerLevel,
		defaultMeta: {service: 'user-service'},
		transports: [
			new transports.Console({
				format: format.combine(
					format(info => {
						info.level = info.level.toUpperCase()
						return info
					})(),
					format.colorize(),
					myFormat,
				),
			}),
		],
		format: format.combine(
			format.label({label: path}),
			format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
			format.errors({stack: true}),
			format.splat(),
		),
		exceptionHandlers: [
			new transports.Console({
				format: format.combine(
					format(info => {
						info.level = info.level.toUpperCase()
						return info
					})(),
					format.colorize(),
					exceptionFormat,
				),
			}),
		],
	})
}

initLogger(module).info(`Logging initialized at ${config.loggerLevel} level`)

export const morganStream: StreamOptions = {
	write(message) {
		initLogger('morgan').info(message)
	},
}

export default initLogger

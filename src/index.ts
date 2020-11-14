import app from './app'
import initLogger from './utils/logger'
import {createConnection} from 'typeorm'
import config from './config'

const logger = initLogger(module)

const server = app.listen(config.port, () => {
	logger.info(`App is running on port ${config.port}`)
})

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed')
			process.exit(1)
		})
	} else {
		process.exit(1)
	}
}

const unexpectedErrorHandler = error => {
	logger.error(error)
	exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
	logger.info('SIGTERM received')
	if (server) {
		server.close()
	}
})

import app from './app'
import initLogger from './utils/logger'
import {createConnection} from 'typeorm'
import config from './config'

const logger = initLogger(module)

createConnection(config.environment)
    .then(() => {
        logger.info('Connect to db successfully!')
    })
    .catch(e => {
        console.log(e)
        logger.error('Db connection error', e.message)
    })

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

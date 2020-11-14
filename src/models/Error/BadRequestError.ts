import {ERROR_CODE, HTTP_STATUS} from './ErrorConstants'
import {HttpError} from './HttpError'

/**
 * Bad Request Error
 */
export class BadRequestError extends HttpError {
	constructor(message: string = 'Invalid request', code?: ERROR_CODE) {
		super(message, HTTP_STATUS.BAD_REQUEST, code)
	}
}

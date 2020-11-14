/**
 * Created by Hai Anh on 6/8/20
 */

import {ERROR_CODE, HTTP_STATUS} from './ErrorConstants'
import {HttpError} from './HttpError'

/**
 * Bad Request Error
 */
export class UnauthorizedError extends HttpError {
	constructor(message: string = 'Not found', code?: ERROR_CODE) {
		super(message, HTTP_STATUS.UNAUTHORIZED, code)
	}
}

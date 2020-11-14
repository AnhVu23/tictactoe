/**
 * Created by Hai Anh on 6/9/20
 */

import {ERROR_CODE, HTTP_STATUS} from './ErrorConstants'
import {HttpError} from './HttpError'

/**
 * Bad Request Error
 */
export class NoContentError extends HttpError {
	constructor(message: string = 'Could not find entity', code?: ERROR_CODE) {
		super(message, HTTP_STATUS.NO_CONTENT, code)
	}
}

/**
 * Created by Hai Anh on 6/8/20
 */

import {ERROR_CODE, HTTP_STATUS} from './ErrorConstants'

/**
 * Custom Http Error
 */
export class HttpError extends Error {
	public readonly status?: HTTP_STATUS
	public readonly code: ERROR_CODE
	public readonly message: string
	constructor(message: string, status?: number, code?: ERROR_CODE) {
		super(message)
		this.status = status
		this.code = code
		this.name = this.constructor.name
		Error.captureStackTrace(this, this.constructor)
	}
}

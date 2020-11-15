/**
 *
 * Game validator
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import {BadRequestError} from '../../models/Error'

export const validateGameBody = (req, res, next) => {
	if (req.body.board == null) {
		throw new BadRequestError('board is required')
	}
	if (typeof req.body.board !== 'string') {
		throw new BadRequestError('Board must be a string')
	}
	if (req.body.board.length !== 9) {
		throw new BadRequestError('Board must include 9 characters')
	}
	next()
}

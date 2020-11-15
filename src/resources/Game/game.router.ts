import * as gameController from './game.controller'

import {Router} from 'express'
import {validateGameBody} from './game.validator'
const router = Router()

router
	.route('/')
	.get(gameController.getAll)
	.post(validateGameBody, gameController.createOne)

router
	.route('/:id')
	.get(gameController.getOne)
	.put(validateGameBody, gameController.editOne)
	.delete(gameController.deleteOne)

export default router

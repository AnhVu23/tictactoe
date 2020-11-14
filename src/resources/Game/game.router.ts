import * as gameController from './game.controller'

import {Router} from 'express'
const router = Router()

router.route('/').get(gameController.getAll).post(gameController.createOne)

router
	.route('/:id')
	.get(gameController.getOne)
	.put(gameController.editOne)
	.delete(gameController.deleteOne)

export default router

import * as gameController from './game.controller'

import {Router} from 'express'
const router = Router()

router.route('/').get(gameController.getAll)

export default router

/**
  *
  * Game Controller
  *
  * @author Anh Vu <vu.haianh291@gmail.com>
  *
  * @copyright Anh Vu
  */
import {getConnection} from 'typeorm'

import config from '../../config'



const getAll = (req, res, next) => {
    try {
        const conn = getConnection(config.environment)
        return res.json('ok')
    } catch (e) {
        return next(e)
    }
}

export {
    getAll
}

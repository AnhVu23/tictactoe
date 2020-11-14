/**
 *
 * Game Controller
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
const getAll = async (req, res, next) => {
    try {
        return res.json('ok')
    } catch (e) {
        return next(e)
    }
}

const createOne = async (req, res, next) => {
    try {
        return
    } catch (e) {
        return next(e)
    }
}

const getOne = async (req, res, next) => {
    try {
        return
    } catch (e) {
        return next(e)
    }
}

const editOne = async (req, res, next) => {
    try {
        return
    } catch (e) {
        return next(e)
    }
}

const deleteOne = async (req, res, next) => {
    try {
        return
    } catch (e) {
        return next(e)
    }
}

export {getAll, createOne, getOne, editOne, deleteOne}

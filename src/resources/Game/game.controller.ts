/**
 *
 * Game Controller
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import {GameService} from './game.service'

const getAll = async (req, res, next) => {
	try {
		const allGames = await new GameService().getAllGames()
		return res.json({
			status: 200,
			data: allGames,
		})
	} catch (e) {
		return next(e)
	}
}

const createOne = async (req, res, next) => {
	try {
		const newGame = await new GameService().createGame(req.body)
		return res.json({
			status: 200,
			data: newGame,
		})
	} catch (e) {
		return next(e)
	}
}

const getOne = async (req, res, next) => {
	try {
		const foundGame = await new GameService().getSingleGame(req.param.id)
		return res.json({
			status: 200,
			data: foundGame,
		})
	} catch (e) {
		return next(e)
	}
}

const editOne = async (req, res, next) => {
	try {
		const resUrl = await new GameService().editGame(req.param.id, req.body)
		res.setHeader('Location', resUrl)
		return res.json({
			status: 204,
		})
	} catch (e) {
		return next(e)
	}
}

const deleteOne = async (req, res, next) => {
	try {
		await new GameService().deleteGame(req.param.id)
		return res.json({
			status: 204,
		})
	} catch (e) {
		return next(e)
	}
}

export {getAll, createOne, getOne, editOne, deleteOne}

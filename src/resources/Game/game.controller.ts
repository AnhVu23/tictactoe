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
			data: allGames,
		})
	} catch (e) {
		return next(e)
	}
}

const createOne = async (req, res, next) => {
	try {
		const newGame = await new GameService().createGame(req.body)
		res.setHeader('Location', newGame)
		return res.status(201).json()
	} catch (e) {
		return next(e)
	}
}

const getOne = async (req, res, next) => {
	try {
		const foundGame = await new GameService().getSingleGame(req.params.id)
		return res.json({
			data: foundGame,
		})
	} catch (e) {
		return next(e)
	}
}

const editOne = async (req, res, next) => {
	try {
		await new GameService().editGame(req.params.id, req.body)
		return res.status(204).json()
	} catch (e) {
		return next(e)
	}
}

const deleteOne = async (req, res, next) => {
	try {
		await new GameService().deleteGame(req.params.id)
		return res.status(204).json()
	} catch (e) {
		return next(e)
	}
}

export {getAll, createOne, getOne, editOne, deleteOne}

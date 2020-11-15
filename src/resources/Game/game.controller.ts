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
		return res.json(allGames)
	} catch (e) {
		return next(e)
	}
}

const createOne = async (req, res, next) => {
	try {
		const newGameUrl = await new GameService().createGame(req.body)
		res.setHeader('Location', newGameUrl)
		return res.status(201).json({
			location: newGameUrl,
		})
	} catch (e) {
		return next(e)
	}
}

const getOne = async (req, res, next) => {
	try {
		const foundGame = await new GameService().getSingleGame(req.params.id)
		return res.json(foundGame)
	} catch (e) {
		return next(e)
	}
}

const editOne = async (req, res, next) => {
	try {
		const gameService = new GameService()
		await gameService.editGame(req.params.id, req.body)
		const editedGame = await gameService.getSingleGame(req.params.id)
		return res.status(200).json(editedGame)
	} catch (e) {
		return next(e)
	}
}

const deleteOne = async (req, res, next) => {
	try {
		await new GameService().deleteGame(req.params.id)
		return res.status(200).json()
	} catch (e) {
		return next(e)
	}
}

export {getAll, createOne, getOne, editOne, deleteOne}

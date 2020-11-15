/**
 *
 * Game service
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import {Connection, getConnection, InsertResult, Repository} from 'typeorm'
import config from '../../config'
import {Game} from './game.model'
import {BadRequestError, NotFoundError} from '../../models/Error'
import {GameStatus} from '../../utils/enum'

type GameMove = 'X' | 'O' | '-'

export class GameService {
	private Game: Repository<Game>
	private conn: Connection
	private boardSize: number
	private readonly allowKeys = ['board']

	constructor() {
		this.conn = getConnection(config.environment)
		this.Game = this.conn.getRepository(Game)
		this.boardSize = 3
	}

	public getAllGames = async (): Promise<Game[]> => {
		try {
			return this.Game.find({})
		} catch (e) {
			throw e
		}
	}

	public createGame = async (body: Partial<Game>): Promise<string> => {
		try {
			const newGame = this.initEntity(this.filterBodyRequest(body))
			newGame.board = this.refineStartBoard(newGame.board)
			const insertRes: InsertResult = await this.Game.insert(newGame)
			return `/api/v1/games/${insertRes.identifiers[0].id}`
		} catch (e) {
			throw e
		}
	}

	public editGame = async (id: number, body: Partial<Game>) => {
		try {
			await this.checkExist(id)
			const editedGame = this.editRunningBoard(body.board)
			await this.Game.update(id, editedGame)
		} catch (e) {
			throw e
		}
	}

	public getSingleGame = async (id: number): Promise<Game> => {
		try {
			return this.checkExist(id)
		} catch (e) {
			throw e
		}
	}

	public deleteGame = async (id: number) => {
		try {
			await this.checkExist(id)
			await this.Game.delete(id)
		} catch (e) {
			throw e
		}
	}

	private initEntity(data: Partial<Game>) {
		return Object.assign(new Game(), data)
	}

	private checkExist = async (id: number): Promise<Game> => {
		try {
			const foundGame = await this.getOne(id)
			if (!foundGame) {
				throw new NotFoundError(`Can't find game`)
			}
			return foundGame
		} catch (e) {
			throw e
		}
	}

	private getOne = async (id: number): Promise<Game> => {
		try {
			return this.Game.findOne(id)
		} catch (e) {
			throw e
		}
	}

	/**
	 * Filter the object and delete uneditable keys
	 * @param body
	 */
	private filterBodyRequest = (body: Partial<Game>) => {
		Object.keys(body).map(key => {
			if (!this.allowKeys.includes(key)) {
				delete body[key]
			}
		})
		return body
	}

	private refineStartBoard = (board: string): string => {
		const emptySpots = board.split('').reduce((total, spot) => {
			if (spot === '-') {
				total += 1
			}
			return total
		}, 0)
		if (emptySpots < 8) {
			throw new BadRequestError(
				'Start board should have more than 8 empty spots',
			)
		} else if (emptySpots === 8) {
			const moveChar = board.indexOf('X') > -1 ? 'X' : 'O'
			return this.makeMove(board, moveChar)
		} else {
			return board
		}
	}

	private editRunningBoard = (board: string): Partial<Game> => {
		let boardArray: string[][] = this.transformBoardToArray(board)
		const xCount = this.findStringCount(board, 'X').length
		const oCount = this.findStringCount(board, 'O').length
		const editedGame = {
			status: GameStatus.RUNNING,
			board,
		}
		if (xCount + oCount < 4) {
			editedGame.board = this.makeMove(board, xCount > oCount ? 'O' : 'X')
		} else if (xCount + oCount === 4) {
			editedGame.board = this.makeMove(board, xCount > oCount ? 'O' : 'X')
			boardArray = this.transformBoardToArray(editedGame.board)
			editedGame.status = this.validateBoard(boardArray)
		} else if (xCount + oCount < 8) {
			editedGame.status = this.validateBoard(boardArray)
			if (editedGame.status === GameStatus.RUNNING) {
				editedGame.board = this.makeMove(board, xCount > oCount ? 'O' : 'X')
				boardArray = this.transformBoardToArray(editedGame.board)
				editedGame.status = this.validateBoard(boardArray)
			}
		} else {
			editedGame.status = this.validateBoard(boardArray)
			if (editedGame.status === GameStatus.RUNNING) {
				editedGame.board = this.makeMove(board, xCount > oCount ? 'O' : 'X')
				boardArray = this.transformBoardToArray(editedGame.board)
				const finalGameStatus = this.validateBoard(boardArray)
				editedGame.status =
					finalGameStatus === GameStatus.RUNNING
						? GameStatus.DRAW
						: finalGameStatus
			}
		}
		return editedGame
	}

	private checkRow = (board: string[][]): string | null => {
		board.forEach(row => {
			if (new Set(row).size === 1 && row[0] !== '-') {
				return row[0]
			}
		})
		return null
	}

	private checkColumn = (board: string[][]) => {
		return this.checkRow(this.transpose(board))
	}

	private checkDiagonal = (board: string[][]) => {
		// There will be 2 diagonal lines for every symmetrical tic tac toe table.
		const diagonalLines = [...Array(2)].map(x =>
			Array(this.boardSize).fill('-'),
		)
		for (let i = 0; i < this.boardSize; i++) {
			diagonalLines[0][i] = board[i][i]
			diagonalLines[1][i] = board[this.boardSize - i - 1][i]
		}
		return this.checkRow(diagonalLines)
	}

	/**
	 * Transform the array 90 degree
	 * @param board
	 */
	private transpose = (board: string[][]): string[][] => {
		const copyBoard: string[][] = [...Array(this.boardSize)].map(x =>
			Array(this.boardSize).fill('-'),
		)
		for (let i = 0; i < this.boardSize; i++) {
			for (let j = 0; j < this.boardSize; j++) {
				copyBoard[j][i] = board[i][j]
			}
		}
		return copyBoard
	}

	private makeMove = (board: string, move: string): string => {
		const emptySpotPos = this.findStringCount(board, '-')
		// Make the random move by filling the empty space
		const movePos = emptySpotPos[Math.random() * emptySpotPos.length - 1]
		board = board.substring(0, movePos) + move + board.substring(movePos + 1)
		return board
	}

	private findStringCount = (board: string, str: GameMove): number[] => {
		const spotPos = []
		let startIndex = 0
		while (board.indexOf(str, startIndex) > -1) {
			const foundIndex = board.indexOf(str)
			spotPos.push(foundIndex)
			// The next start index should be equal to found index + string length
			startIndex = foundIndex + str.length
		}
		return spotPos
	}

	private validateBoard = (boardArray: string[][]): GameStatus => {
		for (let result in [
			this.checkRow(boardArray),
			this.checkColumn(boardArray),
			this.checkDiagonal(boardArray),
		]) {
			if (result !== null) {
				return result === 'X' ? GameStatus.X_WON : GameStatus.O_WON
			}
		}
		return GameStatus.RUNNING
	}

	private transformBoardToArray = (board: string): string[][] => {
		return [...Array(this.boardSize)].map(row =>
			Array(this.boardSize).map(col => {
				return board.charAt(row * this.boardSize + col)
			}),
		)
	}
}

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
			const currentGame = await this.checkExist(id)
			if (currentGame.status !== GameStatus.RUNNING) {
				throw new BadRequestError('Game ended')
			}
			const editedGame = this.editRunningBoard(body.board, currentGame.board)
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

	/**
	 * Check if game exists. If yes, return game entity.
	 * @param id
	 */
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
			const moveChar = board.indexOf('X') > -1 ? 'O' : 'X'
			return this.makeMove(board, moveChar)
		} else {
			return this.makeMove(board, 'X')
		}
	}

	private editRunningBoard = (
		board: string,
		currentBoard: string,
	): Partial<Game> => {
		this.validateMove(board, currentBoard)
		let boardArray: string[][] = this.transformBoardToArray(board)
		const xCount = this.findStringCount(board, 'X').length
		const oCount = this.findStringCount(board, 'O').length
		const editedGame = {
			status: GameStatus.RUNNING,
			board,
		}
		const nextMove = xCount > oCount ? 'O' : 'X'
		// Player and computer can't win until the total moves is bigger or equal to 5.
		if (xCount + oCount < 4) {
			editedGame.board = this.makeMove(board, nextMove)
		} else if (xCount + oCount === 4) {
			editedGame.board = this.makeMove(board, nextMove)
			// Always validate the board again after making move when the total moves is equal or bigger than 5
			boardArray = this.transformBoardToArray(editedGame.board)
			editedGame.status = this.validateBoard(boardArray)
		} else if (xCount + oCount < 8) {
			editedGame.status = this.validateBoard(boardArray)
			if (editedGame.status === GameStatus.RUNNING) {
				editedGame.board = this.makeMove(board, nextMove)
				boardArray = this.transformBoardToArray(editedGame.board)
				editedGame.status = this.validateBoard(boardArray)
			}
		} else {
			editedGame.status = this.validateBoard(boardArray)
			if (editedGame.status === GameStatus.RUNNING) {
				editedGame.board = this.makeMove(board, nextMove)
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
		let result = null
		board.forEach(row => {
			if (new Set(row).size === 1 && row[0] !== '-') {
				result = row[0]
			}
		})
		return result
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
	 * Transform the array 90 degree.
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
		const movePos =
			emptySpotPos[Math.floor(Math.random() * emptySpotPos.length)]
		board = board.substring(0, movePos) + move + board.substring(movePos + 1)
		return board
	}

	private findStringCount = (board: string, str: GameMove): number[] => {
		const spotPos = []
		let startIndex = 0
		while (board.indexOf(str, startIndex) > -1) {
			const foundIndex = board.indexOf(str, startIndex)
			spotPos.push(foundIndex)
			// The next start index should be equal to found index + string length
			startIndex = foundIndex + str.length
		}
		return spotPos
	}

	private validateBoard = (boardArray: string[][]): GameStatus => {
		for (let result of [
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
		const boardArray = [...Array(this.boardSize)].map(
			row => new Array(this.boardSize),
		)
		for (let i = 0; i < this.boardSize; i++) {
			for (let j = 0; j < this.boardSize; j++) {
				boardArray[i][j] = board.charAt(i * this.boardSize + j)
			}
		}
		return boardArray
	}

	private validateMove = (next: string, origin: string) => {
		let totalDiff = 0
		for (let i = 0; i < next.length; i++) {
			if (next.charAt(i) !== origin.charAt(i)) {
				if (origin.charAt(i) === '-') {
					totalDiff += 1
				} else {
					throw new BadRequestError('Invalid move')
				}
			}
		}
		if (totalDiff > 1) {
			throw new BadRequestError(`Invalid board. The board has been modified`)
		}
	}
}

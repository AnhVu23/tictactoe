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
import {NotFoundError} from '../../models/Error'

/**
 * Reason not to
 */
export class GameService {
	private Game: Repository<Game>
	private conn: Connection
	private readonly allowKeys = ['board']

	constructor() {
		this.conn = getConnection(config.environment)
		this.Game = this.conn.getRepository(Game)
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
			const newGame = this.initEntity(body)
			const insertRes: InsertResult = await this.Game.insert(newGame)
			return `/api/v1/games/${insertRes.identifiers[0].id}`
		} catch (e) {
			throw e
		}
	}

	public editGame = async (id: number, body: Partial<Game>) => {
		try {
			await this.checkExist(id)
			await this.Game.update(id, this.filterBodyRequest(body))
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
	private filterBodyRequest = (body: object) => {
		Object.keys(body).map(key => {
			if (!this.allowKeys.includes(key)) {
				delete body[key]
			}
		})
		return body
	}
}

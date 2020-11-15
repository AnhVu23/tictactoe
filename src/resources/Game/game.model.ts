/**
 *
 * Game Model
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import {GameStatus} from '../../utils/enum'

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public board: string

	@Column({
		type: 'enum',
		enum: GameStatus,
		default: GameStatus.RUNNING
	})
	public status: GameStatus
}

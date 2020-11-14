/**
 * Game Model
 *
 * @author Anh Vu <anh.vu@vertics.co>
 *
 * @copyright Vertics Oy 2020
 */

import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public board: string

	@Column()
	public status: BoardStatus
}

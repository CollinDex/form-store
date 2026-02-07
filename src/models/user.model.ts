import { IsEmail } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { getIsInvalidMessage } from '../utils';
import { UserRole } from '../types';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	@IsEmail(undefined, { message: getIsInvalidMessage('Email') })
	email: string;

	@Column({ nullable: true })
	password: string;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER
	})
	role: UserRole;
}

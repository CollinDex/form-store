import { IsEmail } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';
import { getIsInvalidMessage } from '../utils';
import { UserRole } from '../types';
import { ExtendedBaseEntity } from './extended-base-entity';

@Entity()
@Unique(['email'])
export class User extends ExtendedBaseEntity {
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

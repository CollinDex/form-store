import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FormVersion } from './form-version.model';
import { ExtendedBaseEntity } from './extended-base-entity';

@Entity()
export class Form extends ExtendedBaseEntity {
	@Column({ unique: true })
	slug: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	description: string;

	@OneToMany(() => FormVersion, (version) => version.form)
	versions: FormVersion[];
}

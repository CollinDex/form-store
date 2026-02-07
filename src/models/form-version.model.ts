import { Entity, Column, ManyToOne, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { FormSchema } from '../types/form.types';
import { Form } from './form.model';
import { Submission } from './submission.model';
import { ExtendedBaseEntity } from './extended-base-entity';

@Entity()
@Index(['form', 'version'], { unique: true })
export class FormVersion extends ExtendedBaseEntity {
	@Column()
	version: number;

	@Column('jsonb')
	schema: FormSchema;

	@ManyToOne(() => Form, (form) => form.versions)
	form: Form;

	@OneToMany(() => Submission, (submission) => submission.formVersion)
	submissions: Submission[];

	@CreateDateColumn()
	publishedAt: Date;
}

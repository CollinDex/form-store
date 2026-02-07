import { Entity, Column, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm'; // Import JoinColumn
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

	@ManyToOne(() => Form, (form) => form.versions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'formId' })
	form: Form;

	@Column({ nullable: true })
	formId: string;

	@OneToMany(() => Submission, (submission) => submission.formVersion)
	submissions: Submission[];
}

import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { SubmissionAnswers } from '../types/form.types';
import { FormVersion } from './form-version.model';
import { ExtendedBaseEntity } from './extended-base-entity';

@Entity()
export class Submission extends ExtendedBaseEntity {
	@ManyToOne(() => FormVersion, (fv) => fv.submissions)
	formVersion: FormVersion;
	@Column('jsonb')
	answers: SubmissionAnswers;
}

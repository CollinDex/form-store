import { Entity, Column } from 'typeorm';
import { ExtendedBaseEntity } from './extended-base-entity';

@Entity()
export class AuditLog extends ExtendedBaseEntity {
	@Column()
	action: string;

	@Column({ nullable: true })
	entityId: string;

	@Column('jsonb', { nullable: true })
	details: any;
}

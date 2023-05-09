import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@base';

@Entity({ name: 'sync' })
export class SyncEntity extends BaseEntity {
	@Column({ type: 'integer', default: 0 })
	lamport: number;
}

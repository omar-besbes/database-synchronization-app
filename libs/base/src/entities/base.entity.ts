import {
	BaseEntity as BasicEntity,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IBase } from '@base/interfaces/base.inerface';

export abstract class BaseEntity extends BasicEntity implements IBase {
	@PrimaryColumn('uuid')
	id: string;

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamp',
		update: false,
	})
	createdAt: string;

	@PrimaryColumn()
	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp',
	})
	updatedAt: string;

	@DeleteDateColumn({
		name: 'deleted_at',
		type: 'timestamp',
		insert: false,
		nullable: true,
	})
	deletedAt?: string;
}

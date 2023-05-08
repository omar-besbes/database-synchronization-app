import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BaseEntity } from '@base/entities/base.entity';

@Injectable()
export class BaseService<Entity extends BaseEntity> {
	protected readonly logger: Logger;

	constructor(
		protected readonly repository: Repository<Entity>,
		private readonly entityName: string,
	) {
		this.logger = new Logger(entityName);
	}

	async create(
		createDto: DeepPartial<Entity>,
		...args: unknown[]
	): Promise<Entity> {
		const entity = this.repository.create(createDto);
		return await this.repository.save(entity);
	}

	async findAll(...args: unknown[]): Promise<Entity[]> {
		return this.repository.find();
	}

	async findOne(id: Entity['id'], ...args: unknown[]): Promise<Entity> {
		const entity = await this.repository.findOneBy({
			id,
		} as FindOptionsWhere<Entity>);

		if (entity === null)
			throw new NotFoundException(
				`No ${this.entityName} was found with this id`,
			);
		return entity;
	}

	async findBy(
		arg: FindOptionsWhere<Entity>,
		...args: unknown[]
	): Promise<Entity> {
		const entity = await this.repository.findOneBy(arg);

		if (entity === null)
			throw new NotFoundException(
				`No ${this.entityName} was found with this id`,
			);
		return entity;
	}

	async update(
		entity: Entity,
		updateDto: Partial<Entity>,
		...args: unknown[]
	): Promise<Entity> {
		entity = { ...entity, ...updateDto };
		return await this.repository.save(entity);
	}

	async remove(
		id: Entity['id'],
		...args: unknown[]
	): Promise<{ count: number }> {
		const { affected } = await this.repository.softDelete(id);

		if (affected < 1)
			throw new NotFoundException(
				`No ${this.entityName} was found with this id`,
			);
		return { count: affected };
	}

	async restore(
		id: Entity['id'],
		...args: unknown[]
	): Promise<{ count: number }> {
		const { affected } = await this.repository.restore(id);

		if (affected < 1)
			throw new NotFoundException(
				`No ${this.entityName} was found with this id`,
			);
		return { count: affected };
	}
}

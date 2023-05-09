import {
	DeepPartial,
	FindManyOptions,
	FindOptionsWhere,
	Repository,
} from 'typeorm';
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
		this.logger.log(entity.id);
		return await this.repository.save(entity);
	}

	async createMany(
		createDtos: DeepPartial<Entity>[],
		...args: unknown[]
	): Promise<Entity[]> {
		const entities = this.repository.create(createDtos);
		return Promise.all(
			entities.map((entity) => {
				return this.repository.save(entity);
			}),
		);
	}

	async findMany(
		arg?: FindManyOptions<Entity>,
		...args: unknown[]
	): Promise<Entity[]> {
		return this.repository.find(arg);
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

	async findOneBy(
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
		updateDto: DeepPartial<Entity>,
		...args: unknown[]
	): Promise<Entity> {
		entity = { ...entity, ...updateDto };
		return await this.repository.save(entity);
	}

	async updateMany(
		entities: { entity: Entity; dto: DeepPartial<Entity> }[],
		...args: unknown[]
	): Promise<Entity[]> {
		return Promise.all(
			entities.map(({ entity, dto }) => {
				entity = { ...entity, ...dto };
				return this.repository.save(entity);
			}),
		);
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

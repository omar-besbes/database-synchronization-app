import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncEntity } from '@sync/sync.entity';

export class SyncService {
	private sync_id: string;

	constructor(
		@InjectRepository(SyncEntity)
		private readonly repository: Repository<SyncEntity>,
	) {
		this.initialize(repository);
	}

	async getLastSync() {
		return this.repository
			.findOne({ where: { id: this.sync_id } })
			.then((sync) => sync.updatedAt);
	}

	async updateLastSync() {
		const sync_entity = await this.repository.findOne({
			where: { id: this.sync_id },
		});
		sync_entity.lamport++;
		return await sync_entity.save().then(({ updatedAt }) => updatedAt);
	}

	private async initialize(repository: Repository<SyncEntity>) {
		const res = await repository.find();
		if (res.length === 0) {
			const sync = await repository.create();
			this.sync_id = sync.id;
			await sync.save();
		} else {
			const [sync] = res;
			this.sync_id = sync.id;
		}
	}
}

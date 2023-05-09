import { Controller, Logger, Post } from '@nestjs/common';
import { ProductSales, ProductSalesService } from '@product-sales';
import { RabbitmqService } from '@rabbitmq';
import { HeadService } from './head.service';
import { SyncService } from '@sync';

@Controller()
export class HeadController {
	private readonly logger: Logger;

	constructor(
		private readonly branchService: HeadService,
		private readonly rabbitmqService: RabbitmqService,
		private readonly productSales: ProductSalesService,
		private readonly syncService: SyncService,
	) {
		this.logger = new Logger(HeadController.name);
	}

	@Post()
	async sync() {
		// get last sync time
		const last_sync = await this.syncService.getLastSync();

		// get changes from queue
		const remote_records: ProductSales[] = (
			await this.rabbitmqService.consumeAll()
		).map((message) => JSON.parse(message));

		// get local records from db
		const local_records = await this.productSales.findMany({
			withDeleted: true,
		});

		// for each change insert in db
		const messages: string[] = [];
		for (const remote_record of remote_records) {
			const local_record = local_records.find(
				(record) => record.id === remote_record.id,
			);

			if (!local_record) {
				this.logger.log(
					`${remote_record.product} not found locally. Adding to local database & other branches ...`,
				);
				await this.productSales.update(remote_record, remote_record);
				messages.push(JSON.stringify(remote_record));
				continue;
			}

			if (
				Math.max(
					new Date(remote_record.updatedAt).getTime(),
					new Date(remote_record.deletedAt).getTime(),
				) <
				Math.max(
					new Date(local_record.updatedAt).getTime(),
					new Date(local_record.deletedAt).getTime(),
				)
			) {
				this.logger.log(
					`${remote_record.product} local version is newer. Sending to send exchange ...`,
				);
			} else {
				this.logger.log(
					`${remote_record.product} remote version is newer. Sending to local database & other branches ...`,
				);
				const modification =
					remote_record.deletedAt &&
					remote_record.deletedAt > remote_record.updatedAt
						? 'delete'
						: 'upsert';

				switch (modification) {
					case 'upsert':
						await this.productSales.update(remote_record, remote_record);
						break;
					case 'delete':
						await this.productSales.remove(remote_record.id);
						break;
				}

				messages.push(JSON.stringify(remote_record));
			}
		}

		// get local changes and add them to messages
		local_records.forEach((local_record) => {
			if (
				Math.max(
					new Date(local_record.updatedAt).getTime(),
					new Date(local_record.deletedAt).getTime(),
				) > new Date(last_sync).getTime()
			) {
				messages.push(JSON.stringify(local_record));
			}
		});
		this.logger.log(messages);

		await this.rabbitmqService.sendMany(messages);
		const sync = await this.syncService.updateLastSync();
		this.logger.log(`synchronized ${sync}`);
	}
}

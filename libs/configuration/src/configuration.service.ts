import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '@config/configs/database.config';
import { MiscConfig } from '@config/configs/misc.config';
import { OfficesConfig } from '@config/configs/offices.config';
import { RabbitmqConfig } from '@config/configs/rabbitmq.config';

@Injectable()
export class ConfigurationService extends ConfigService {
	getDatabaseConfig(): DatabaseConfig {
		return this.getOrThrow<DatabaseConfig>('database');
	}

	getMiscConfig(): MiscConfig {
		return this.getOrThrow<MiscConfig>('misc');
	}

	getOfficesConfig(): OfficesConfig {
		return this.getOrThrow<OfficesConfig>('offices');
	}

	getRabbitMQConfig(): RabbitmqConfig {
		return this.getOrThrow<RabbitmqConfig>('rabbitmq');
	}
}

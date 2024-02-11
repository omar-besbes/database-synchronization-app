import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '@config/config-keys';
import { IsUrl } from 'class-validator';
import extract from '@config/validate';

export interface RabbitmqConfig {
	url: string;
}

class EnvVariables {
	@IsUrl({ protocols: ['amqp', 'amqps', 'mqtt'], require_tld: false })
	RABBITMQ_URL: string;
}

export const rabbitmqConfig = registerAs(
	ConfigKeys.rabbitmq,
	(): RabbitmqConfig => {
		const envVariables = extract(EnvVariables);
		return {
			url: envVariables.RABBITMQ_URL,
		};
	},
);

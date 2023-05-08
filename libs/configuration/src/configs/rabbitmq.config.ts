import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface RabbitmqConfig {
	url: string;
}

export const rabbitmqConfig = registerAs(
	'rabbitmq',
	(): RabbitmqConfig => ({
		url: process.env.RABBITMQ_URL,
	}),
);

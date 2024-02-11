import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '@config/config-keys';
import { IsNotEmpty } from 'class-validator';
import extract from '@config/validate';

export interface OfficesConfig {
	id: string;
	head_office: string;
	send_exchange: string;
	consume_exchange: string;
	queue: string;
}

class EnvVariables {
	@IsNotEmpty()
	ID: string;
	@IsNotEmpty()
	HEAD_OFFICE: string;
	@IsNotEmpty()
	SEND_EXCHANGE: string;
	@IsNotEmpty()
	CONSUME_EXCHANGE: string;
	@IsNotEmpty()
	QUEUE: string;
}

export const officesConfig = registerAs(
	ConfigKeys.offices,
	(): OfficesConfig => {
		const envVariables = extract(EnvVariables);
		return {
			id: envVariables.ID,
			head_office: envVariables.HEAD_OFFICE,
			send_exchange: envVariables.SEND_EXCHANGE,
			consume_exchange: envVariables.CONSUME_EXCHANGE,
			queue: envVariables.QUEUE,
		};
	},
);

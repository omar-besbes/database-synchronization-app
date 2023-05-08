import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface OfficesConfig {
	id: string;
	head_office: string;
	branch_offices: Set<string>;
	send_exchange: string;
	consume_exchange: string;
	queue: string;
}

export const officesConfig = registerAs(
	'offices',
	(): OfficesConfig => ({
		id: process.env.ID,
		head_office: process.env.HEAD_OFFICE,
		branch_offices: new Set(process.env.BRANCH_OFFICES.split(',')),
		send_exchange: process.env.SEND_EXCHANGE,
		consume_exchange: process.env.CONSUME_EXCHANGE,
		queue: process.env.QUEUE,
	}),
);

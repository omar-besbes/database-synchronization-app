import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface OfficesConfig {
	id: string;
	head_office: string;
	branch_offices: Set<string>;
}

export const officesConfig = registerAs(
	'offices',
	(): OfficesConfig => ({
		id: process.env.ID,
		head_office: process.env.HEAD_OFFICE,
		branch_offices: new Set(process.env.BRANCH_OFFICES.split(',')),
	}),
);

import { registerAs } from '@nestjs/config';
import * as process from 'process';

export enum Environment {
	development = 'development',
	test = 'test',
	production = 'production',
}

export interface MiscConfig {
	environment: Environment;
	port: number;
}

export const miscConfig = registerAs(
	'misc',
	(): MiscConfig => ({
		environment:
			(process.env.NODE_ENV as Environment) ?? Environment.development,
		port: parseInt(
			process.env.PORT && process.env.PORT !== ''
				? process.env.PORT
				: '3000',
		),
	}),
);

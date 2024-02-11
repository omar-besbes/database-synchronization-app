import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '@config/config-keys';
import { IsEnum, IsPort } from 'class-validator';
import extract from '@config/validate';

export enum Environment {
	development = 'development',
	test = 'test',
	production = 'production',
}

export interface MiscConfig {
	environment: Environment;
	port: number;
}

class EnvVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment = Environment.development;
	@IsPort()
	PORT: string;
}

export const miscConfig = registerAs(ConfigKeys.misc, (): MiscConfig => {
	const envVariables = extract(EnvVariables);
	return {
		environment: envVariables.NODE_ENV,
		port: parseInt(envVariables.PORT),
	};
});

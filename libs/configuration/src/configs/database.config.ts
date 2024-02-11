import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import { ConfigKeys } from '@config/config-keys';
import { IsFQDN, IsNotEmpty, IsPort } from 'class-validator';
import extract from '@config/validate';

export interface DatabaseConfig {
	type: DatabaseType;
	username?: string;
	password?: string;
	host?: string;
	port?: number;
	database?: string;
}

class EnvVariables {
	@IsNotEmpty()
	DB_TYPE: DatabaseType;
	@IsNotEmpty()
	DB_USERNAME: string;
	@IsNotEmpty()
	DB_PASSWORD: string;
	@IsFQDN({
		allow_numeric_tld: true,
		require_tld: false,
		allow_underscores: true,
	})
	DB_HOST: string;
	@IsPort()
	DB_PORT: string;
	@IsNotEmpty()
	DB_NAME: string;
}

export const databaseConfig = registerAs(
	ConfigKeys.database,
	(): DatabaseConfig => {
		const envVariables = extract(EnvVariables);
		return {
			type: envVariables.DB_TYPE,
			username: envVariables.DB_USERNAME,
			password: envVariables.DB_PASSWORD,
			host: envVariables.DB_HOST,
			port: parseInt(envVariables.DB_PORT),
			database: envVariables.DB_NAME,
		};
	},
);

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HeadController } from './head.controller';
import { HeadService } from './head.service';
import { ConfigurationModule, ConfigurationService } from '@config';
import { databaseConfig } from '@config/configs/database.config';
import { Environment, miscConfig } from '@config/configs/misc.config';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigurationModule],
			inject: [ConfigurationService],
			useFactory: (
				configService: ConfigurationService,
			): TypeOrmModuleOptions => ({
				...(configService.getDatabaseConfig() as Record<never, never>),
				synchronize:
					configService.getMiscConfig().environment !==
					Environment.production,
				ssl: {
					rejectUnauthorized:
						configService.getMiscConfig().environment ===
						Environment.production,
				},
				autoLoadEntities: true,
				logging: 'all',
			}),
		}),
		ConfigurationModule.forRoot({
			envFilePath: [
				'.env.local',
				'.env',
				'.env.production.local',
				'.env.production',
				'.env.development.local',
				'.env.development',
			],
			load: [databaseConfig, miscConfig],
			expandVariables: true,
			cache: true,
		}),
	],
	controllers: [HeadController],
	providers: [HeadService],
})
export class HeadModule {}

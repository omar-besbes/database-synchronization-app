import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { ConfigurationModule, ConfigurationService } from '@config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment, miscConfig } from '@config/configs/misc.config';
import { databaseConfig } from '@config/configs/database.config';

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
				'env',
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
	controllers: [BranchController],
	providers: [BranchService],
})
export class BranchModule {}

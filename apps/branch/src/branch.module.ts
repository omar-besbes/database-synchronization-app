import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import {
	ConfigurationModule,
	ConfigurationService,
	officesConfig,
	rabbitmqConfig,
} from '@config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment, miscConfig } from '@config/configs/misc.config';
import { databaseConfig } from '@config/configs/database.config';
import { ProductSalesController } from '@product-sales/product-sales.controller';
import { RabbitmqModule } from '@rabbitmq';
import { ProductSalesModule } from '@product-sales';
import { join } from 'path';
import * as process from 'process';
import { SyncModule } from '@sync/sync.module';

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
				join(process.cwd(), 'apps', 'branch', '.env.local'),
				join(process.cwd(), 'apps', 'branch', '.env'),
				join(process.cwd(), 'apps', 'branch', '.env.production.local'),
				join(process.cwd(), 'apps', 'branch', '.env.production'),
				join(process.cwd(), 'apps', 'branch', '.env.development.local'),
				join(process.cwd(), 'apps', 'branch', '.env.development'),
			],
			load: [databaseConfig, miscConfig, rabbitmqConfig, officesConfig],
			expandVariables: true,
			cache: true,
		}),
		RabbitmqModule,
		ProductSalesModule,
		SyncModule,
	],
	controllers: [BranchController, ProductSalesController],
	providers: [BranchService],
})
export class BranchModule {}

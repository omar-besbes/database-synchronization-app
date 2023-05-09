import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HeadController } from './head.controller';
import { HeadService } from './head.service';
import {
	ConfigurationModule,
	ConfigurationService,
	officesConfig,
	rabbitmqConfig,
} from '@config';
import { databaseConfig } from '@config/configs/database.config';
import { Environment, miscConfig } from '@config/configs/misc.config';
import { ProductSalesController } from '@product-sales/product-sales.controller';
import { join } from 'path';
import * as process from 'process';
import { RabbitmqModule } from '@rabbitmq';
import { ProductSalesModule } from '@product-sales';
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
				join(process.cwd(), 'apps', 'head', '.env.local'),
				join(process.cwd(), 'apps', 'head', '.env'),
				join(process.cwd(), 'apps', 'head', '.env.production.local'),
				join(process.cwd(), 'apps', 'head', '.env.production'),
				join(process.cwd(), 'apps', 'head', '.env.development.local'),
				join(process.cwd(), 'apps', 'head', '.env.development'),
			],
			load: [databaseConfig, miscConfig, rabbitmqConfig, officesConfig],
			expandVariables: true,
			cache: true,
		}),
		RabbitmqModule,
		ProductSalesModule,
		SyncModule,
	],
	controllers: [HeadController, ProductSalesController],
	providers: [HeadService],
})
export class HeadModule {}

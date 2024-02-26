import { NestFactory } from '@nestjs/core';
import { ConfigurationService } from '@config';
import {Logger, ValidationPipe} from '@nestjs/common';
import { BaseInterceptor } from '@base';
import { HeadModule } from './head.module';

async function bootstrap() {
	const app = await NestFactory.create(HeadModule);
	const configService = app.get(ConfigurationService);
	const logger = app.get(Logger);

	// enable validation
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);

	// standardize response
	app.useGlobalInterceptors(new BaseInterceptor());

	// enable logging
	app.useLogger(['log', 'error', 'warn']);

	// get port to listen on from environment variables
	const { port } = configService.getMiscConfig();

	await app.listen(port);
	logger.log(`HEAD OFFICE Listening on port ${port}`, "BootstrapFunction");
}

bootstrap();

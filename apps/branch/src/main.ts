import { NestFactory } from '@nestjs/core';
import { ConfigurationService } from '@config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { BaseInterceptor } from '@base/base';
import { BranchModule } from './branch.module';

async function bootstrap() {
	const app = await NestFactory.create(BranchModule);
	const configService = app.get(ConfigurationService);

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
}

bootstrap();

import { InternalServerErrorException } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as process from 'process';

export default function extract<C extends object>(
	EnvVariables: ClassConstructor<C>,
) {
	const envVariables = plainToClass(EnvVariables, process.env, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(envVariables, {
		skipNullProperties: false,
		skipMissingProperties: false,
		forbidUnknownValues: true,
	});

	if (errors.length > 0) {
		throw new InternalServerErrorException(
			errors.map((error) => error.toString()).join('\n'),
		);
	}

	return envVariables;
}

import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
	statusCode: number;
	message: string;
	data?: T;
}

@Injectable()
export class BaseInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map<T, Response<T>>((data) =>
				data === undefined
					? {
							message: 'Success',
							statusCode: context.switchToHttp().getResponse()
								.statusCode,
					  }
					: {
							message: 'Success',
							statusCode: context.switchToHttp().getResponse()
								.statusCode,
							data: data,
					  },
			),
		);
	}
}

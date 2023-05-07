import { Injectable } from '@nestjs/common';

@Injectable()
export class HeadService {
	getHello(): string {
		return 'Hello World!';
	}
}

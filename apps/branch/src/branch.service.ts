import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchService {
	getHello(): string {
		return 'Hello World!';
	}
}

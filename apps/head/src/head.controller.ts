import { Controller } from '@nestjs/common';
import { HeadService } from './head.service';

@Controller()
export class HeadController {
	constructor(private readonly headService: HeadService) {}
}

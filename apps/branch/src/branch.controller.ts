import { Controller } from '@nestjs/common';
import { BranchService } from './branch.service';

@Controller()
export class BranchController {
	constructor(private readonly branchService: BranchService) {}
}

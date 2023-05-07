import { Module } from '@nestjs/common';
import { HeadController } from './head.controller';
import { HeadService } from './head.service';

@Module({
  imports: [],
  controllers: [HeadController],
  providers: [HeadService],
})
export class HeadModule {}

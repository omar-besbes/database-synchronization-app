import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ConfigurationModule } from '@config';

@Module({
	imports: [ConfigurationModule],
	providers: [RabbitmqService],
	exports: [RabbitmqService],
})
export class RabbitmqModule {}

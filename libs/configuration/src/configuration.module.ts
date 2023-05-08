import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from '@config/configuration.service';

@Module({
	imports: [ConfigModule],
	providers: [ConfigurationService],
	exports: [ConfigurationService],
})
export class ConfigurationModule extends ConfigModule {}

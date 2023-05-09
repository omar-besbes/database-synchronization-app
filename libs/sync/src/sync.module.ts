import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncEntity } from '@sync/sync.entity';
import { SyncService } from '@sync/sync.service';

@Module({
	imports: [TypeOrmModule.forFeature([SyncEntity])],
	providers: [SyncService],
	exports: [SyncService],
})
export class SyncModule {}

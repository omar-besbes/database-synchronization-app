import { Module } from '@nestjs/common';
import { ProductSalesService } from './product-sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSales } from '@product-sales/product-sales.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ProductSales])],
	providers: [ProductSalesService],
	exports: [ProductSalesService],
})
export class ProductSalesModule {}

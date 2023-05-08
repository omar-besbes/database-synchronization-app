import { IProductSales } from '@product-sales/product-sales.interface';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductSaleDto implements IProductSales {
	@IsNumber()
	amount: number;

	@IsNumber()
	cost: number;

	@Type(() => Date)
	date: Date;

	@IsString()
	product: string;

	@IsInt()
	quantity: number;

	@IsString()
	region: string;

	@IsNumber()
	tax: number;

	@IsNumber()
	total: number;
}

import { Injectable } from '@nestjs/common';
import { BaseService } from '@base';
import { ProductSales } from '@product-sales/product-sales.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductSaleDto } from '@product-sales/create-product-sale.dto';
import { UpdateProductSaleDto } from '@product-sales/update-product-sale.dto';

@Injectable()
export class ProductSalesService extends BaseService<ProductSales> {
	constructor(
		@InjectRepository(ProductSales)
		protected repository: Repository<ProductSales>,
	) {
		super(repository, ProductSales.name);
	}

	async create(
		createDto: CreateProductSaleDto,
		...args
	): Promise<ProductSales> {
		return super.create(createDto, ...args);
	}

	async createMany(
		createDtos: CreateProductSaleDto[],
		...args
	): Promise<ProductSales[]> {
		return super.createMany(createDtos, ...args);
	}

	async update(
		entity: ProductSales,
		updateDto: UpdateProductSaleDto,
		...args
	): Promise<ProductSales> {
		return super.update(entity, updateDto, ...args);
	}

	async updateMany(
		entities: {
			entity: ProductSales;
			dto: UpdateProductSaleDto;
		}[],
		...args
	): Promise<ProductSales[]> {
		return super.updateMany(entities, ...args);
	}
}

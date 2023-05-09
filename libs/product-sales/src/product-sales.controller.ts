import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ProductSalesService } from '@product-sales/product-sales.service';
import { CreateProductSaleDto } from '@product-sales/create-product-sale.dto';
import { UpdateProductSaleDto } from '@product-sales/update-product-sale.dto';
import { ProductSales } from '@product-sales/product-sales.entity';

@Controller('product-sales')
export class ProductSalesController {
	constructor(private readonly service: ProductSalesService) {}

	@Post('create')
	async create(@Body() dto: CreateProductSaleDto) {
		return this.service.create(dto);
	}

	@Get('find')
	async findMany() {
		return this.service.findMany();
	}

	@Get('find/:id')
	async findOneById(@Param('id', ParseUUIDPipe) id: ProductSales['id']) {
		return this.service.findOne(id);
	}

	@Patch('update/:id')
	async update(
		@Param('id', ParseUUIDPipe) id: ProductSales['id'],
		@Body() dto: UpdateProductSaleDto,
	) {
		const product_sale = await this.service.findOne(id);
		return this.service.update(product_sale, dto);
	}

	@Delete('remove/:id')
	async remove(@Param('id', ParseUUIDPipe) id: ProductSales['id']) {
		return this.service.remove(id);
	}

	@Patch('restore/:id')
	async restore(@Param('id', ParseUUIDPipe) id: ProductSales['id']) {
		return this.service.restore(id);
	}
}

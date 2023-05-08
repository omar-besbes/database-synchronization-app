import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@base';
import { IProductSales } from '@product-sales/product-sales.interface';

@Entity({ name: 'product_sales' })
export class ProductSales extends BaseEntity implements IProductSales {
	@Column({ type: 'float' })
	amount: number;

	@Column({ type: 'float' })
	cost: number;

	@Column({ type: 'date' })
	date: Date;

	@Column({ type: 'varchar' })
	product: string;

	@Column({ type: 'integer' })
	quantity: number;

	@Column({ type: 'varchar' })
	region: string;

	@Column({ type: 'float' })
	tax: number;

	@Column({ type: 'float' })
	total: number;
}

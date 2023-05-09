import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigurationService } from '@config';

@Injectable()
export class RabbitmqService {
	private readonly logger: Logger;
	private readonly broker_url: string;
	private readonly id: string;
	private readonly send_exchange: string;
	private readonly consume_exchange: string;
	private readonly queue: string;

	private connection: amqp.Connection;
	private channel: amqp.Channel;

	constructor(private readonly configService: ConfigurationService) {
		this.logger = new Logger(RabbitmqService.name);
		this.broker_url = configService.getRabbitMQConfig().url;
		this.id = configService.getOfficesConfig().id;
		this.send_exchange = configService.getOfficesConfig().send_exchange;
		this.consume_exchange = configService.getOfficesConfig().consume_exchange;
		this.queue = configService.getOfficesConfig().queue;

		this.initialize();
	}

	async initialize() {
		await this.connect();
		await this.channel.assertQueue(this.queue, { durable: true });
		await this.channel.assertExchange(this.send_exchange, 'fanout', {
			durable: true,
		});
		await this.channel.assertExchange(this.consume_exchange, 'fanout', {
			durable: true,
		});
		await this.channel.bindQueue(this.queue, this.consume_exchange, this.id);
		await this.close();
	}

	async connect() {
		this.connection = await amqp.connect(this.broker_url);
		this.channel = await this.connection.createChannel();
	}

	async close() {
		await this.channel.close();
		await this.connection.close();
	}

	async send(message: string, options?: amqp.Options.Publish) {
		await this.connect();

		const result = this.channel.publish(
			this.send_exchange,
			this.id,
			Buffer.from(message),
			options ?? {
				persistent: true,
			},
		);

		this.logger.log(
			`sending to exchange ${this.send_exchange} message: \n${message}`,
		);
		await this.close();
		return result;
	}

	async sendMany(messages: string[], options?: amqp.Options.Publish) {
		await this.connect();

		const results: boolean[] = [];
		messages.forEach((message) => {
			const result = this.channel.publish(
				this.send_exchange,
				this.id,
				Buffer.from(message),
				options ?? {
					persistent: true,
				},
			);
			results.push(result);
		});

		this.logger.log(
			`sending to exchange ${this.send_exchange} message: \n${messages}`,
		);
		await this.close();
		return results;
	}

	async consume(options?: amqp.Options.Consume) {
		await this.connect();

		let message: string;
		const msg = await this.channel.get(this.queue, options);
		if (msg) {
			message = msg.content.toString();
			await this.channel.ack(msg);
		}

		this.logger.log(`consuming from queue ${this.queue}: \n${message}`);
		await this.close();
		return message;
	}

	async consumeAll(options?: amqp.Options.Consume) {
		await this.connect();
		const buffer_size = 10;
		await this.channel.prefetch(buffer_size);

		let messages: amqp.GetMessage[] = [];
		do {
			messages = [];
			for (let i = 0; i < buffer_size; i++) {
				const msg = await this.channel.get(this.queue, options);
				if (msg) messages.push(msg);
				else break;
			}

			for (const message of messages) {
				await this.channel.ack(message);
			}
		} while (messages.length === buffer_size);

		this.logger.log(`consuming from queue ${this.queue}: \n${messages}`);
		await this.close();
		return messages.map((message) => message.content.toString());
	}
}

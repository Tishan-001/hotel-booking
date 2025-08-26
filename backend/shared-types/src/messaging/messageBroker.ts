import * as amqp from 'amqplib';
import { Connection, Channel, ConsumeMessage, Options } from 'amqplib';
import { DomainEvent, EXCHANGE_NAMES, QUEUE_NAMES } from '../events';

export class MessageBroker {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly rabbitmqUrl: string;

    constructor(rabbitmqUrl?: string) {
        this.rabbitmqUrl = rabbitmqUrl || process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    }

    async connect(): Promise<void> {
        try {
            console.log('🐰 Connecting to RabbitMQ...');
            this.connection = await amqp.connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            
            // Setup exchanges
            await this.setupExchanges();
            
            console.log('✅ RabbitMQ connected and configured');
        } catch (error) {
            console.error('❌ Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    private async setupExchanges(): Promise<void> {
        if (!this.channel) throw new Error('Channel not initialized');

        // Create topic exchanges for domain events
        await this.channel.assertExchange(EXCHANGE_NAMES.DOMAIN_EVENTS, 'topic', { 
            durable: true 
        });
        
        await this.channel.assertExchange(EXCHANGE_NAMES.NOTIFICATIONS, 'topic', { 
            durable: true 
        });

        // Optionally create DLX (Dead Letter Exchange)
        await this.channel.assertExchange(`${EXCHANGE_NAMES.DOMAIN_EVENTS}.dlx`, 'topic', {
            durable: true
        });
    }

    async publishEvent(event: DomainEvent, routingKey?: string): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        const eventMessage = JSON.stringify(event);
        const key = routingKey || this.getRoutingKey(event.type);
        
        try {
            const published = this.channel.publish(
                EXCHANGE_NAMES.DOMAIN_EVENTS,
                key,
                Buffer.from(eventMessage),
                {
                    persistent: true,
                    timestamp: Date.now(),
                    messageId: this.generateMessageId(),
                    type: event.type,
                    headers: {
                        'x-retry-count': 0
                    }
                }
            );

            if (published) {
                console.log(`📤 Event published: ${event.type} -> ${key}`);
            } else {
                console.warn(`⚠️ Event may not have been published: ${event.type}`);
                // Implement retry logic here if needed
                throw new Error('Failed to publish event');
            }
        } catch (error) {
            console.error(`❌ Failed to publish event ${event.type}:`, error);
            throw error;
        }
    }

    async subscribeToQueue(
        queueName: string,
        routingKeys: string[],
        handler: (event: DomainEvent, msg: ConsumeMessage) => Promise<void>,
        exchange: string = EXCHANGE_NAMES.DOMAIN_EVENTS
    ): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        // Assert DLQ (Dead Letter Queue)
        const dlqName = `${queueName}.dlq`;
        await this.channel.assertQueue(dlqName, {
            durable: true,
            arguments: {
                'x-message-ttl': 604800000 // 7 days
            }
        });
        await this.channel.bindQueue(dlqName, `${exchange}.dlx`, '#');

        // Assert main queue with DLX configuration
        await this.channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-message-ttl': 86400000, // 24 hours
                'x-dead-letter-exchange': `${exchange}.dlx`,
                'x-dead-letter-routing-key': '#'
            }
        });

        // Bind queue to exchange with routing keys
        for (const routingKey of routingKeys) {
            await this.channel.bindQueue(queueName, exchange, routingKey);
        }

        // Set prefetch to process one message at a time
        await this.channel.prefetch(1);

        // Start consuming
        await this.channel.consume(queueName, async (msg) => {
            if (!msg) return;

            try {
                const event = JSON.parse(msg.content.toString()) as DomainEvent;
                console.log(`📥 Processing event: ${event.type} (Queue: ${queueName})`);
                
                await handler(event, msg);
                
                // Acknowledge message
                this.channel?.ack(msg);
                console.log(`✅ Event processed: ${event.type}`);
                
            } catch (error) {
                console.error(`❌ Error processing message in queue ${queueName}:`, error);
                
                // Get current retry count and increment
                const headers = msg.properties.headers || {};
                const retryCount = (headers['x-retry-count'] as number) || 0;
                
                if (retryCount < 3) {
                    console.log(`🔄 Retrying message (attempt ${retryCount + 1}/3)`);
                    
                    // Requeue with incremented retry count
                    this.channel?.nack(msg, false, true);
                } else {
                    console.log(`💀 Message moved to DLQ after 3 attempts`);
                    this.channel?.nack(msg, false, false);
                }
            }
        });

        console.log(`🎧 Subscribed to queue: ${queueName} with routing keys: ${routingKeys.join(', ')}`);
    }

    private getRoutingKey(eventType: string): string {
        return eventType.toLowerCase().replace(/[^a-z0-9._-]/g, '.');
    }

    private generateMessageId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async createQueue(queueName: string, options: Options.AssertQueue = {}): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        await this.channel.assertQueue(queueName, {
            durable: true,
            ...options
        });
    }

    async bindQueueToExchange(queueName: string, exchange: string, routingKey: string): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        await this.channel.bindQueue(queueName, exchange, routingKey);
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
                console.log('📪 RabbitMQ channel closed');
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
                console.log('🔌 RabbitMQ connection closed');
            }
        } catch (error) {
            console.error('❌ Error closing RabbitMQ connection:', error);
            throw error;
        }
    }

    // Health check method
    async isConnected(): Promise<boolean> {
        return !!(this.connection && this.channel);
    }

    // Get channel for advanced operations
    getChannel(): Channel {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }
        return this.channel;
    }

    // Get connection for advanced operations
    getConnection(): Connection {
        if (!this.connection) {
            throw new Error('RabbitMQ connection not initialized');
        }
        return this.connection;
    }
}

// Singleton instance with lazy initialization
let messageBrokerInstance: MessageBroker | null = null;

export const getMessageBroker = (rabbitmqUrl?: string): MessageBroker => {
    if (!messageBrokerInstance) {
        messageBrokerInstance = new MessageBroker(rabbitmqUrl);
    }
    return messageBrokerInstance;
};

export const initializeMessageBroker = async (rabbitmqUrl?: string): Promise<MessageBroker> => {
    const broker = getMessageBroker(rabbitmqUrl);
    await broker.connect();
    return broker;
};

export default MessageBroker;
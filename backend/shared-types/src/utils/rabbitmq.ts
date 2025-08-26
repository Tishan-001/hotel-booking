import * as amqp from 'amqplib';

export class RabbitMQConnection {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private url: string;

  constructor(url: string = process.env.RABBITMQ_URL || 'amqp://localhost:5672') {
    this.url = url;
  }

async connect(): Promise<void> {
  try {
    const conn = await amqp.connect(this.url);
    this.connection = conn;
    this.channel = await conn.createChannel();
    
    console.log('Connected to RabbitMQ');
    
    // Handle connection errors
    this.connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });
    
    this.connection.on('close', () => {
      console.log('RabbitMQ connection closed');
    });
    
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized. Call connect() first.');
    }
    return this.channel;
  }

  async ensureQueue(queueName: string): Promise<void> {
    const channel = this.getChannel();
    await channel.assertQueue(queueName, { durable: true });
  }

  async publishMessage(queueName: string, message: any): Promise<void> {
    const channel = this.getChannel();
    await this.ensureQueue(queueName);
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, messageBuffer, { persistent: true });
    
    console.log(`Published message to ${queueName}:`, message.type);
  }

  async consumeMessages(queueName: string, callback: (message: any) => Promise<void>): Promise<void> {
    const channel = this.getChannel();
    await this.ensureQueue(queueName);
    
    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          console.log(`Received message from ${queueName}:`, message.type);
          
          await callback(message);
          channel.ack(msg);
        } catch (error) {
          console.error(`Error processing message from ${queueName}:`, error);
          channel.nack(msg, false, false); // Reject and don't requeue
        }
      }
    });
    
    console.log(`Listening for messages on ${queueName}`);
  }
}

// Singleton instance
let rabbitmqInstance: RabbitMQConnection | null = null;

export const getRabbitMQInstance = (): RabbitMQConnection => {
  if (!rabbitmqInstance) {
    rabbitmqInstance = new RabbitMQConnection();
  }
  return rabbitmqInstance;
};
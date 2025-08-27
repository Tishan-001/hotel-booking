import { getRabbitMQInstance } from 'shared-types';
import { BookingCreatedEvent, Message } from 'shared-types';
import { v4 as uuidv4 } from 'uuid';

export class BookingMessagingService {
  private rabbitmq = getRabbitMQInstance();

  async initialize(): Promise<void> {
    await this.rabbitmq.connect();
  }

  async publishBookingCreated(bookingData: BookingCreatedEvent): Promise<void> {
    const message: Message<BookingCreatedEvent> = {
      type: 'BOOKING_CREATED',
      data: bookingData,
      timestamp: new Date(),
      id: uuidv4()
    };

    await this.rabbitmq.publishMessage('booking.created', message);
  }
}
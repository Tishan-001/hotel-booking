import { getRabbitMQInstance } from 'shared-types';
import { Message, BookingCreatedEvent } from 'shared-types';
import EmailService from './emailService';

export class NotificationsMessagingService {
  private rabbitmq = getRabbitMQInstance();
  private emailService = new EmailService();

  async initialize(): Promise<void> {
    await this.rabbitmq.connect();
    await this.setupConsumers();
  }

  private async setupConsumers(): Promise<void> {
    // Listen for booking created events
    await this.rabbitmq.consumeMessages('booking.created', async (message: Message<BookingCreatedEvent>) => {
      if (message.type === 'BOOKING_CREATED') {
        await this.handleBookingCreated(message.data);
      }
    });
  }

  private async handleBookingCreated(bookingData: BookingCreatedEvent): Promise<void> {
    try {
      console.log(`Processing booking created event for booking ${bookingData.bookingId}`);
      
      // Send booking confirmation email
      await this.emailService.sendBookingConfirmation({
        booking: {
          _id: bookingData.bookingId,
          userId: bookingData.userId,
          hotelId: bookingData.hotelId,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.userEmail,
          adultCount: bookingData.adultCount,
          childCount: bookingData.childCount,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          totalCost: bookingData.totalCost
        },
        hotel: {
          name: bookingData.hotelName,
          city: bookingData.hotelCity,
          country: bookingData.hotelCountry
        },
        user: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.userEmail
        }
      });
      
      console.log(`Booking confirmation email sent for ${bookingData.bookingId}`);
    } catch (error) {
      console.error(`Failed to process booking created event:`, error);
    }
  }
}
export interface BookingCreatedEvent {
  bookingId: string;
  userId: string;
  hotelId: string;
  userEmail: string;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  totalCost: number;
  firstName: string;
  lastName: string;
}

export interface UserRegisteredEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type MessageType = 'BOOKING_CREATED' | 'USER_REGISTERED';

export interface Message<T = any> {
  type: MessageType;
  data: T;
  timestamp: Date;
  id: string;
}
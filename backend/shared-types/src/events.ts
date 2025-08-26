export interface BookingCreatedEvent {
    type: 'booking.created';
    data: {
        bookingId: string;
        userId: string;
        hotelId: string;
        userEmail: string;
        checkIn: Date;
        checkOut: Date;
        totalCost: number;
        firstName: string;
        lastName: string;
    };
}

export interface UserRegisteredEvent {
    type: 'user.registered';
    data: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface NotificationEvent {
    type: 'notification.send';
    data: {
        recipient: string;
        subject: string;
        template: string;
        data: any;
    };
}

export type DomainEvent = 
    | BookingCreatedEvent 
    | UserRegisteredEvent 
    | NotificationEvent;

// Queue Names
export const QUEUE_NAMES = {
    BOOKING_EVENTS: 'booking.events',
    USER_EVENTS: 'user.events',
    NOTIFICATION_EVENTS: 'notification.events',
    EMAIL_QUEUE: 'email.queue'
} as const;

// Exchange Names
export const EXCHANGE_NAMES = {
    DOMAIN_EVENTS: 'domain.events',
    NOTIFICATIONS: 'notifications'
} as const;
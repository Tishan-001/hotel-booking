import nodemailer from 'nodemailer';
import { BookingType } from 'shared-types';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface BookingEmailData {
    booking: BookingType;
    hotel: {
        name: string;
        city: string;
        country: string;
        address?: string;
    };
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendBookingConfirmation(emailData: BookingEmailData): Promise<void> {
        const { booking, hotel, user } = emailData;
        
        const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

        const htmlContent = this.generateBookingConfirmationHTML({
            booking,
            hotel,
            user,
            checkInDate,
            checkOutDate,
            nights
        });

        const mailOptions = {
            from: `"Hotel Booking System" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: `Booking Confirmation - ${hotel.name}`,
            html: htmlContent
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Booking confirmation email sent to ${user.email}`);
        } catch (error) {
            console.error(`❌ Failed to send booking confirmation email:`, error);
            throw new Error(`Failed to send booking confirmation email: ${error}`);
        }
    }

    private generateBookingConfirmationHTML(data: any): string {
        const { booking, hotel, user, checkInDate, checkOutDate, nights } = data;
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
                .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e2e8f0; }
                .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
                .detail-label { font-weight: bold; color: #475569; }
                .detail-value { color: #1e293b; }
                .total-cost { background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏨 Booking Confirmed!</h1>
                    <p>Thank you for your reservation</p>
                </div>
                
                <div class="content">
                    <p>Dear ${user.firstName} ${user.lastName},</p>
                    <p>We're excited to confirm your booking! Here are the details:</p>
                    
                    <div class="booking-details">
                        <h3 style="margin-top: 0; color: #2563eb;">📍 Hotel Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Hotel Name:</span>
                            <span class="detail-value">${hotel.name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${hotel.city}, ${hotel.country}</span>
                        </div>
                        
                        <h3 style="color: #2563eb;">📅 Booking Details</h3>
                        <div class="detail-row">
                            <span class="detail-label">Check-in:</span>
                            <span class="detail-value">${checkInDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Check-out:</span>
                            <span class="detail-value">${checkOutDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Number of Nights:</span>
                            <span class="detail-value">${nights}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Adults:</span>
                            <span class="detail-value">${booking.adultCount}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Children:</span>
                            <span class="detail-value">${booking.childCount}</span>
                        </div>
                    </div>
                    
                    <div class="total-cost">
                        💰 Total Cost: LKR ${booking.totalCost.toLocaleString()}
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 8px;">
                        <h4 style="margin-top: 0; color: #1d4ed8;">Important Information:</h4>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li>Please bring a valid ID for check-in</li>
                            <li>Check-in time is usually after 2:00 PM</li>
                            <li>Check-out time is usually before 11:00 AM</li>
                            <li>Contact the hotel directly for any special requests</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px;">If you have any questions about your booking, please don't hesitate to contact us.</p>
                    <p>We look forward to hosting you!</p>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        <strong>Hotel Booking Team</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>© 2025 Hotel Booking System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified successfully');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }
}

export default EmailService;
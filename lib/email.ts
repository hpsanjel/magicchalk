import nodemailer from "nodemailer";
import { format } from "date-fns";

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASS,
	},
});

export async function sendConfirmationEmail(
	to: string,
	orderDetails: {
		orderId: string;
		eventId: string;
		amount: number;
		currency: string;
	}
) {
	const mailOptions = {
		from: `"Magic Chalk School" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Order Confirmation",
		text: `Thank you for your order!
    
Order ID: ${orderDetails.orderId}
Event ID: ${orderDetails.eventId}
Amount: ${orderDetails.amount / 100} ${orderDetails.currency.toUpperCase()}

We look forward to seeing you at the event!`,
		html: `
      <h1>Thank you for your order!</h1>
      <p>Here are your order details:</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderDetails.orderId}</li>
        <li><strong>Event ID:</strong> ${orderDetails.eventId}</li>
        <li><strong>Amount:</strong> ${orderDetails.amount / 100} ${orderDetails.currency.toUpperCase()}</li>
      </ul>
      <p>We look forward to seeing you at the event!</p>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Confirmation email sent successfully");
	} catch (error) {
		console.error("Error sending confirmation email:", error);
		throw new Error("Failed to send confirmation email");
	}
}

export async function sendTourBookingConfirmation(
	to: string,
	bookingDetails: {
		parentFirstName: string;
		parentLastName: string;
		childFirstName: string;
		childLastName: string;
		preferredDate: string;
		preferredTime: string;
		confirmedDate?: string;
		confirmedTime?: string;
		phone: string;
	}
) {
	// Use confirmed date/time if available, otherwise fall back to preferred
	const tourDate = bookingDetails.confirmedDate || bookingDetails.preferredDate;
	const tourTime = bookingDetails.confirmedTime || bookingDetails.preferredTime;
	const formattedDate = format(new Date(tourDate), "EEEE, MMMM d, yyyy");

	const mailOptions = {
		from: `"Magic Chalk School" <${process.env.EMAIL_USER}>`,
		to,
		subject: "School Tour Booking Confirmed - Magic Chalk",
		text: `Dear ${bookingDetails.parentFirstName} ${bookingDetails.parentLastName},

Your school tour booking has been confirmed!

Tour Details:
Child Name: ${bookingDetails.childFirstName} ${bookingDetails.childLastName}
Date: ${formattedDate}
Time: ${tourTime}

Please arrive 10 minutes early. If you need to reschedule or have any questions, please contact us.

We look forward to showing you around our school!

Best regards,
Magic Chalk School Administration`,
		html: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
.content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
.details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
.detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
.detail-row:last-child { border-bottom: none; }
.label { font-weight: bold; color: #16a34a; }
.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>🎉 Tour Booking Confirmed!</h1>
</div>
<div class="content">
<h2>Dear ${bookingDetails.parentFirstName} ${bookingDetails.parentLastName},</h2>
<p>Great news! Your school tour booking has been confirmed.</p>
<div class="details">
<div class="detail-row">
<span class="label">Child Name:</span> ${bookingDetails.childFirstName} ${bookingDetails.childLastName}
</div>
<div class="detail-row">
<span class="label">Tour Date:</span> ${formattedDate}
</div>
<div class="detail-row">
<span class="label">Tour Time:</span> ${tourTime}
</div>
</div>
<p><strong>Important Reminders:</strong></p>
<ul>
<li>Please arrive 10 minutes early</li>
<li>Bring any questions you may have about our programs</li>
<li>Feel free to bring other family members</li>
</ul>
<p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
<p>We look forward to welcoming you and showing you around our school!</p>
<p>Best regards,<br>
<strong>Magic Chalk School Administration</strong></p>
</div>
<div class="footer">
<p>This is an automated confirmation email. Please do not reply to this email.</p>
<p style="margin-top: 10px;">Visit our website: <a href="https://magicchalk.vercel.app" style="color: #16a34a; text-decoration: none;">magicchalk.vercel.app</a></p>
</div>
</div>
</body>
</html>`,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Tour booking confirmation email sent successfully");
	} catch (error) {
		console.error("Error sending tour booking confirmation email:", error);
		throw new Error("Failed to send tour booking confirmation email");
	}
}

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendConfirmationEmail(
	to: string,
	orderDetails: {
		orderId: string;
		eventId: string;
		amount: number;
		currency: string;
	}
) {
	const msg = {
		to,
		from: "contact@harisanjel.com.np", // Replace with your verified SendGrid sender
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
		await sgMail.send(msg);
		console.log("Confirmation email sent successfully");
	} catch (error) {
		console.error("Error sending confirmation email:", error);
		throw new Error("Failed to send confirmation email");
	}
}

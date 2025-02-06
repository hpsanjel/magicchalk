import { NextResponse } from "next/server";
import Quote from "@/models/Quote.Model";
import connectDB from "@/lib/mongodb";

interface FormData {
	eventType: string;
	companyName: string;
	address: string;
	contactName: string;
	email: string;
	phone: string;
	offeredPrice: string;
	additionalInfo?: string;
	recaptchaToken: string; // Add reCAPTCHA token
}

export async function POST(request: Request) {
	try {
		await connectDB();

		const formData: FormData = await request.json();

		// Validate required fields
		if (!formData.eventType || !formData.companyName || !formData.address || !formData.contactName || !formData.email || !formData.phone || !formData.offeredPrice || !formData.recaptchaToken) {
			return NextResponse.json({ success: false, message: "Please enter all the missing required fields" }, { status: 400 });
		}

		// Verify reCAPTCHA token
		const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				secret: process.env.RECAPTCHA_SECRET_KEY || "",
				response: formData.recaptchaToken,
			}).toString(),
		});

		const recaptchaData = await recaptchaResponse.json();

		if (!recaptchaData.success || recaptchaData.score < 0.5) {
			return NextResponse.json({ success: false, message: "reCAPTCHA verification failed" }, { status: 400 });
		}

		// Save the form data to MongoDB
		const newQuote = new Quote(formData);
		await newQuote.save();

		// Send data to Web3Forms
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				access_key: process.env.WEBFORM_API,
				...formData,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			return NextResponse.json({
				success: true,
				message: "Form submitted successfully and saved in MongoDB",
			});
		} else {
			console.error("Web3Forms submission failed:", data.message);
			return NextResponse.json({
				success: true,
				message: "Form saved in MongoDB, but Web3Forms submission failed",
				webformError: data.message,
			});
		}
	} catch (error) {
		console.error("Error submitting form:", error);
		return NextResponse.json({ success: false, message: "An error occurred while submitting the form" }, { status: 500 });
	}
}

// import { NextResponse } from "next/server";
// import Quote from "@/models/Quote.Model";
// import connectDB from "@/lib/mongodb";

// interface FormData {
// 	eventType: string;
// 	companyName: string;
// 	address: string;
// 	contactName: string;
// 	email: string;
// 	phone: string;
// 	offeredPrice: string;
// 	additionalInfo?: string;
// }

// export async function POST(request: Request) {
// 	try {
// 		await connectDB();

// 		const formData: FormData = await request.json();

// 		if (!formData.eventType || !formData.companyName || !formData.address || !formData.contactName || !formData.email || !formData.phone || !formData.offeredPrice) {
// 			return NextResponse.json({ success: false, message: "Please enter all the missing required fields" }, { status: 400 });
// 		}

// 		const newQuote = new Quote(formData);
// 		await newQuote.save();

// 		const response = await fetch("https://api.web3forms.com/submit", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Accept: "application/json",
// 			},
// 			body: JSON.stringify({
// 				access_key: process.env.WEBFORM_API,
// 				...formData,
// 			}),
// 		});

// 		const data = await response.json();

// 		if (response.ok) {
// 			return NextResponse.json({
// 				success: true,
// 				message: "Form submitted successfully and saved in MongoDB",
// 			});
// 		} else {
// 			console.error("Web3Forms submission failed:", data.message);
// 			return NextResponse.json({
// 				success: true,
// 				message: "Form saved in MongoDB, but Web3Forms submission failed",
// 				webformError: data.message,
// 			});
// 		}
// 	} catch (error) {
// 		console.error("Error submitting form:", error);
// 		return NextResponse.json({ success: false, message: "An error occurred while submitting the form" }, { status: 500 });
// 	}
// }

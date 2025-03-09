import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdmissionForm from "@/models/AdmissionForm.Model";

export async function GET() {
	try {
		await connectDB();
		const admissions = await AdmissionForm.find({}).sort({ createdAt: -1 });
		return NextResponse.json({ admissions });
	} catch (error) {
		console.error("Error fetching admissions:", error);
		return NextResponse.json({ error: error.message || "Failed to fetch admissions" }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await connectDB();
		const body = await request.json();
		const { admission } = body;

		console.log("Received admission email:", admission);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!admission || typeof admission !== "string" || !emailRegex.test(admission)) {
			return NextResponse.json(
				{
					success: false,
					error: "Please provide a valid email address.",
				},
				{ status: 400 }
			);
		}
		const normalizedEmail = admission.toLowerCase().trim();

		// Check for existing admission
		const existingAdmissionForm = await AdmissionForm.findOne({ admission: normalizedEmail });
		if (existingAdmissionForm) {
			return NextResponse.json(
				{
					success: false,
					error: "This email is already subscribed.",
				},
				{ status: 400 }
			);
		}

		// Save the new admission
		const admissionData = await AdmissionForm.create({ admission: normalizedEmail });
		console.log("AdmissionForm saved successfully:", admissionData);

		return NextResponse.json(
			{
				success: true,
				admission: admissionData,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Detailed Error:", {
			message: error.message,
			name: error.name,
			stack: error.stack,
		});

		// Handle Mongoose validation errors
		if (error.name === "ValidationError") {
			return NextResponse.json(
				{
					success: false,
					error: Object.values(error.errors)[0].message,
				},
				{ status: 400 }
			);
		}

		// Handle duplicate key error
		if (error.code === 11000) {
			return NextResponse.json(
				{
					success: false,
					error: "This email is already subscribed.",
				},
				{ status: 400 }
			);
		}

		// Generic error handler
		return NextResponse.json(
			{
				success: false,
				error: "An error occurred while processing your request.",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

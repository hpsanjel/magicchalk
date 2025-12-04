import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TourBooking from "@/models/TourBooking.Model";

// Ensure database connection
connectDB();

// GET - Retrieve all tour bookings
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const status = searchParams.get("status");
		const date = searchParams.get("date");

		let query = {};

		if (status) {
			query.status = status;
		}

		if (date) {
			const searchDate = new Date(date);
			searchDate.setHours(0, 0, 0, 0);
			const nextDay = new Date(searchDate);
			nextDay.setDate(nextDay.getDate() + 1);

			query.preferredDate = {
				$gte: searchDate,
				$lt: nextDay,
			};
		}

		const tourBookings = await TourBooking.find(query).sort({ createdAt: -1 }).limit(100);
		return NextResponse.json(tourBookings, { status: 200 });
	} catch (error) {
		console.error("Error retrieving tour bookings:", error);
		return NextResponse.json({ message: "Failed to retrieve tour bookings", error: error.message }, { status: 500 });
	}
}

// POST - Create a new tour booking
export async function POST(req) {
	try {
		const body = await req.json();
		const { parentFirstName, parentLastName, email, phone, childFirstName, childLastName, childDob, preferredDate, preferredTime } = body;

		if (!parentFirstName || !parentLastName || !email || !phone || !childFirstName || !childLastName || !childDob || !preferredDate || !preferredTime) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		const newTourBooking = new TourBooking(body);
		await newTourBooking.save();

		return NextResponse.json({ message: "Tour booking created successfully", tourBooking: newTourBooking }, { status: 201 });
	} catch (error) {
		console.error("Error creating tour booking:", error);

		if (error.name === "ValidationError") {
			const validationErrors = {};
			for (const field in error.errors) {
				validationErrors[field] = error.errors[field].message;
			}

			return NextResponse.json({ message: "Validation error", errors: validationErrors }, { status: 400 });
		}

		return NextResponse.json({ message: "Failed to create tour booking", error: error.message }, { status: 500 });
	}
}

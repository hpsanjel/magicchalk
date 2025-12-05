import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability.Model";

// GET - Retrieve all available dates with time slots
export async function GET() {
	try {
		await connectDB();

		// Get all availability records sorted by date
		const availableDates = await Availability.find({}).sort({ date: 1 });

		// Filter out past dates and format the response
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const futureDates = availableDates.filter((avail) => {
			const availDate = new Date(avail.date);
			availDate.setHours(0, 0, 0, 0);
			return availDate >= today;
		});

		return NextResponse.json(futureDates, { status: 200 });
	} catch (error) {
		console.error("Error retrieving availability:", error);
		return NextResponse.json({ message: "Failed to retrieve availability", error: error.message }, { status: 500 });
	}
}

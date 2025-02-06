import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote.Model";

export async function GET() {
	try {
		await connectDB();
		const quotes = await Quote.find();
		return NextResponse.json({ success: true, quotes }, { status: 200 });
	} catch (error) {
		console.error("Error fetching quotes:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

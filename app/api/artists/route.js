import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artist from "@/models/Artist.Model";

export async function GET() {
	try {
		await connectDB();

		const artists = await Artist.find();

		return NextResponse.json({ success: true, artists }, { status: 200 });
	} catch (error) {
		console.error("Error fetching artists:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

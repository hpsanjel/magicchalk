import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery.Model";

export async function GET() {
	try {
		await connectDB();

		const gallery = await Gallery.find();
		const categories = await Gallery.distinct("category");

		return NextResponse.json({ success: true, gallery, categories }, { status: 200 });
	} catch (error) {
		console.error("Error fetching gallery items:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

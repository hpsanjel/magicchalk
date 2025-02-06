import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner.Model";

export async function GET() {
	try {
		await connectDB();
		const partners = await Partner.find();
		return NextResponse.json({ success: true, partners }, { status: 200 });
	} catch (error) {
		console.error("Error fetching partners:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

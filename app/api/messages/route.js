import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message.Model";

export async function GET() {
	try {
		await connectDB();
		const messages = await Message.find();
		return NextResponse.json({ success: true, messages }, { status: 200 });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

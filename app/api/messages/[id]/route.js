import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message.Model";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const messageId = id;

		const deletedmessage = await Message.findByIdAndDelete(messageId);

		if (!deletedmessage) {
			return NextResponse.json({ success: false, error: "message not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const messageId = id;
		const message = await Message.findById(messageId);

		if (!message) {
			return NextResponse.json({ success: false, error: "message not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

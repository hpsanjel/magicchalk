import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote.Model";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const quoteId = id;

		const deletedquote = await Quote.findByIdAndDelete(quoteId);

		if (!deletedquote) {
			return NextResponse.json({ success: false, error: "quote not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, quote: "Quote deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const quoteId = id;
		const quote = await Quote.findById(quoteId);

		if (!quote) {
			return NextResponse.json({ success: false, error: "quote not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

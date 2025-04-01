import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User.Model";

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const userId = id;

		const deleteduser = await User.findByIdAndDelete(userId);

		if (!deleteduser) {
			return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

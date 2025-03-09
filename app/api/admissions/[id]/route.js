import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/AdmissionForm.Model";

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const admissionId = id;

		const deletedadmission = await Subscriber.findByIdAndDelete(admissionId);

		if (!deletedadmission) {
			return NextResponse.json({ success: false, error: "admission not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "admission deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

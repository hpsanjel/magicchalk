import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice.Model";
import { uploadToCloudinary } from "@/utils/saveFileToCloudinaryUtils";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function PUT(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const formData = await request.formData();
		const noticeId = id;

		const noticeData = {};
		for (const [key, value] of formData.entries()) {
			if (key !== "noticeimage") {
				noticeData[key] = value;
			}
		}

		const noticeimage = formData.get("noticeimage");
		if (noticeimage) {
			noticeData.noticeimage = await uploadToCloudinary(noticeimage, "notice_images");
		}

		const updatedNotice = await Notice.findByIdAndUpdate(noticeId, noticeData, { new: true });

		if (!updatedNotice) {
			return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, Notice: updatedNotice }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const noticeId = id;

		const deletedNotice = await Notice.findByIdAndDelete(noticeId);

		if (!deletedNotice) {
			return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "Notice deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const noticeId = id;
		const Notice = await Notice.findById(noticeId);

		if (!Notice) {
			return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, Notice }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

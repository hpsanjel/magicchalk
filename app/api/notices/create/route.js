import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice.Model";
import { uploadToCloudinary } from "@/utils/saveFileToCloudinaryUtils";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(request) {
	try {
		await connectDB();

		// Parse the incoming form data
		const formData = await request.formData();
		console.log("Received form data");

		const noticetitle = formData.get("noticetitle");
		const notice1 = formData.get("notice");
		const noticedate = formData.get("noticedate");
		const noticeimage = formData.get("noticeimage");

		console.log("Parsed form data:", { noticetitle, notice1, noticedate, noticeimage });

		// Validate input
		if (!noticetitle || !notice1 || !noticedate) {
			return NextResponse.json({ success: false, error: "All fields are required to create a notice" }, { status: 400 });
		}

		let noticeImageUrl = null;
		if (noticeimage) {
			noticeImageUrl = await uploadToCloudinary(noticeimage, "notice_images");
		}

		// Save the notice to MongoDB
		console.log("Saving notice to database");
		const notice = await Notice.create({
			noticetitle,
			notice: notice1,
			noticedate,
			noticeimage: noticeImageUrl,
		});
		console.log("Notice saved successfully:", notice);

		return NextResponse.json({ success: true, notice }, { status: 201 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

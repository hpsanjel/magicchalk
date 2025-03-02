import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event.Model";
import { uploadToCloudinary } from "@/utils/saveFileToCloudinaryUtils";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(request) {
	try {
		await connectDB();

		const formData = await request.formData();
		console.log("Received form data", formData);

		const eventname = formData.get("eventname");
		const eventdescription = formData.get("eventdescription");
		const eventcountry = formData.get("eventcountry");
		const eventvenue = formData.get("eventvenue");
		const eventdate = formData.get("eventdate");
		const earlyBirdPrice = formData.get("earlyBirdPrice");
		const vipPrice = formData.get("vipPrice");
		const standardPrice = formData.get("standardPrice");
		const frontRowPrice = formData.get("frontRowPrice");
		const backRowPrice = formData.get("backRowPrice");
		const preSalePrice = formData.get("preSalePrice");
		const doorSalePrice = formData.get("doorSalePrice");
		const eventtime = formData.get("eventtime");
		const eventspotifyUrl = formData.get("eventspotifyUrl");
		const eventyoutubeUrl = formData.get("eventyoutubeUrl");
		const eventposter = formData.get("eventposter");
		if (!eventposter || typeof eventposter.arrayBuffer !== "function") {
			return NextResponse.json({ success: false, error: "Invalid file upload for eventposter" }, { status: 400 });
		}

		const eventposter2 = formData.get("eventposter2");
		const eventposter3 = formData.get("eventposter3");
		const eventvideo = formData.get("eventvideo");

		// Validate input
		if (!eventname || !eventcountry || !eventposter) {
			return NextResponse.json({ success: false, error: "Required fields are missing" }, { status: 400 });
		}

		// Format the date
		const formattedDate = new Date(eventdate).toISOString().split("T")[0];

		// Upload images to Cloudinary
		const eventposterUrl = await uploadToCloudinary(eventposter, "magic_chalk_event_images");
		const eventposter2Url = eventposter2 ? await uploadToCloudinary(eventposter2, "magic_chalk_event_images") : null;
		const eventposter3Url = eventposter3 ? await uploadToCloudinary(eventposter3, "magic_chalk_event_images") : null;
		const eventvideoUrl = eventvideo ? await uploadToCloudinary(eventvideo, "magic_chalk_event_images") : null;

		// Save event to MongoDB
		console.log("Creating event in database");
		const event = await Event.create({
			eventname,
			eventdescription,
			eventcountry,
			eventvenue,
			eventdate: formattedDate,
			earlyBirdPrice,
			vipPrice,
			standardPrice,
			frontRowPrice,
			backRowPrice,
			preSalePrice,
			doorSalePrice,
			eventtime,
			eventspotifyUrl,
			eventyoutubeUrl,
			eventposterUrl,
			eventposter2Url,
			eventposter3Url,
			eventvideoUrl,
		});
		console.log("Event created successfully:", event);

		return NextResponse.json({ success: true, event }, { status: 201 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

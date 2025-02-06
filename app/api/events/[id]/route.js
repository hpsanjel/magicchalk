import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event.Model";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "@/utils/saveFileToCloudinaryUtils";

export const config = {
	api: {
		bodyParser: false,
	},
};

async function deleteFromCloudinary(url) {
	try {
		// Delete the file from Cloudinary
		const publicId = url.split("/").pop().split(".")[0];
		console.log("Deleting Cloudinary publicId:", publicId);
		await cloudinary.uploader.destroy(`event_images/${publicId}`);
		console.log("Cloudinary deletion result:", result);
		if (result.result !== "ok" && result.result !== "not_found") {
			throw new Error(`Failed to delete resource: ${result.result}`);
		}
	} catch (error) {
		console.error("Error deleting from Cloudinary:", error);
		throw error;
	}
}

export async function PUT(request, { params }) {
	const { id } = params;

	try {
		await connectDB();

		const formData = await request.formData();
		const eventId = id;

		const eventData = {};
		for (const [key, value] of formData.entries()) {
			if (key !== "eventposter" && key !== "eventposter2" && key !== "eventposter3" && key !== "eventvideo") {
				eventData[key] = value;
			}
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
		}

		// Handle video update and deletion
		const eventvideo = formData.get("eventvideo");
		if (eventvideo && eventvideo.size > 0) {
			if (event.eventvideoUrl) {
				console.log("Old video URL:", event.eventvideoUrl);
				await deleteFromCloudinary(event.eventvideoUrl);
			}
			eventData.eventvideoUrl = await uploadToCloudinary(eventvideo, "event_images");
		}

		// Handle other uploads similarly...

		const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

		return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

// Helper to delete Cloudinary files
// async function deleteFromCloudinary(url) {
// 	const publicId = url.split("/").pop().split(".")[0];
// 	await cloudinary.uploader.destroy(`event_images/${publicId}`);
// }

// async function deleteFromCloudinary(url) {
// 	try {
// 		// Extract the publicId from the URL
// 		const splitUrl = url.split("/");
// 		const folderAndFileName = splitUrl.slice(-2).join("/"); // Extract the last two parts (folder and filename)
// 		const publicId = folderAndFileName.split(".")[0]; // Remove file extension
// 		console.log("Deleting Cloudinary publicId:", publicId);

// 		// Delete the file from Cloudinary
// 		const result = await cloudinary.uploader.destroy(publicId);
// 		console.log("Cloudinary deletion result:", result);
// 			} catch (error) {
// 		console.error("Error deleting from Cloudinary:", error);
// 		throw error;
// 	}
// }

// export async function PUT(request, { params }) {
// 	const { id } = await params;

// 	try {
// 		await connectDB();

// 		const formData = await request.formData();
// 		const eventId = id;

// 		const eventData = {};
// 		for (const [key, value] of formData.entries()) {
// 			if (key !== "eventposter" && key !== "eventposter2" && key !== "eventposter3" && key !== "eventvideo") {
// 				eventData[key] = value;
// 			}
// 		}

// 		const event = await Event.findById(eventId);
// 		if (!event) {
// 			return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
// 		}

// 		// Handle image uploads
// 		const eventposter = formData.get("eventposter");
// 		if (eventposter && eventposter.size > 0) {
// 			if (event.eventposterUrl) await deleteFromCloudinary(event.eventposterUrl);
// 			eventData.eventposterUrl = await uploadToCloudinary(eventposter, "event_images");
// 		}

// 		const eventposter2 = formData.get("eventposter2");
// 		if (eventposter2 && eventposter2.size > 0) {
// 			if (event.eventposter2Url) await deleteFromCloudinary(event.eventposter2Url);
// 			eventData.eventposter2Url = await uploadToCloudinary(eventposter2, "event_images");
// 		}

// 		const eventposter3 = formData.get("eventposter3");
// 		if (eventposter3 && eventposter3.size > 0) {
// 			if (event.eventposter3Url) await deleteFromCloudinary(event.eventposter3Url);
// 			eventData.eventposter3Url = await uploadToCloudinary(eventposter3, "event_images");
// 		}
// 		const eventvideo = formData.get("eventvideo");
// 		if (eventvideo && eventvideo.size > 0) {
// 			if (event.eventvideoUrl) await deleteFromCloudinary(event.eventvideoUrl);
// 			eventData.eventvideoUrl = await uploadToCloudinary(eventvideo, "event_images");
// 		}

// 		const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

// 		return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 });
// 	} catch (error) {
// 		console.error("Error in API route:", error);
// 		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
// 	}
// }

// DELETE API to delete event
export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const event = await Event.findByIdAndDelete(id);
		if (!event) {
			return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
		}

		// Delete images from Cloudinary
		if (event.eventposterUrl) await deleteFromCloudinary(event.eventposterUrl);
		if (event.eventposter2Url) await deleteFromCloudinary(event.eventposter2Url);
		if (event.eventposter3Url) await deleteFromCloudinary(event.eventposter3Url);
		// if (event.eventvideoUrl) await deleteFromCloudinary(event.eventvideoUrl);

		return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

// GET API to fetch event details
export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const event = await Event.findById(id);
		if (!event) {
			return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, event }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

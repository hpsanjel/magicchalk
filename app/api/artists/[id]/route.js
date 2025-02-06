import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artist from "@/models/Artist.Model";
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
		const artistId = id;

		const artistData = {};
		for (const [key, value] of formData.entries()) {
			if (key !== "eventposter") {
				artistData[key] = value;
			}
		}

		const image = formData.get("image");
		if (image) {
			artistData.image = await uploadToCloudinary(image, "artists_images");
		}

		const updatedArtist = await Event.findByIdAndUpdate(artistId, artistData, { new: true });

		if (!updatedArtist) {
			return NextResponse.json({ success: false, error: "Artist not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, artist: updatedArtist }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const artistId = id;

		const deletedArtist = await Artist.findByIdAndDelete(artistId);

		if (!deletedArtist) {
			return NextResponse.json({ success: false, error: "Artist not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "Artist deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const artistId = id;
		const artist = await Artist.findById(artistId);

		if (!artist) {
			return NextResponse.json({ success: false, error: "Artist not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, artist }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artist from "@/models/Artist.Model";
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
		console.log("Received artist form data");

		const name = formData.get("name");
		const genre = formData.get("genre");
		const image = formData.get("image"); // Expecting a file
		const bio = formData.get("bio");
		const totalsongs = parseInt(formData.get("totalsongs"), 10);
		const rating = parseFloat(formData.get("rating"));
		const popularSongs = JSON.parse(formData.get("popularSongs") || "[]"); // Parse JSON array
		const facebook = formData.get("facebook");
		const instagram = formData.get("instagram");
		const performanceCount = parseInt(formData.get("performanceCount"), 10);
		const contact = formData.get("contact");
		const featured = formData.get("featured") === "true"; // Convert string to boolean

		console.log("Parsed form data:", {
			name,
			genre,
			image,
			bio,
			totalsongs,
			rating,
			popularSongs,
			facebook,
			instagram,
			performanceCount,
			contact,
			featured,
		});

		// Validate required fields
		if (!name || !genre || !bio || !contact || !image) {
			return NextResponse.json({ success: false, error: "Required fields are missing" }, { status: 400 });
		}

		// Save the image file to the uploads directory
		const imageUrl = await uploadToCloudinary(image, "artist_images");

		// Save artist data to MongoDB
		console.log("Creating artist in database");
		const artist = await Artist.create({
			name,
			genre,
			image: imageUrl,
			bio,
			totalsongs,
			rating,
			popularSongs,
			socialMedia: {
				facebook,
				instagram,
			},
			performanceCount,
			contact,
			featured,
		});
		console.log("Artist saved successfully:", artist);

		return NextResponse.json({ success: true, artist }, { status: 201 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

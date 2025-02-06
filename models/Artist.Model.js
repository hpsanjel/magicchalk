import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema({
	facebook: {
		type: String,
		default: "",
	},
	instagram: {
		type: String,
		default: "",
	},
});

const artistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		genre: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true, // Assuming the image is always required
		},
		bio: {
			type: String,
			required: true,
			trim: true,
		},
		totalsongs: {
			type: Number,
			default: null, // Allows null to differentiate from 0
		},
		rating: {
			type: Number,
			default: null, // Allows null to differentiate from 0
			min: 0,
			max: 5,
		},
		popularSongs: {
			type: [String], // Array of strings
			default: [],
		},
		socialMedia: {
			type: socialMediaSchema, // Nested schema
			default: () => ({}), // Default as empty object
		},
		performanceCount: {
			type: Number,
			default: null, // Allows null to differentiate from 0
		},
		contact: {
			type: String,
			required: true,
			trim: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
); // Adds createdAt and updatedAt timestamps

const Artist = mongoose.models.Artist || mongoose.model("Artist", artistSchema);

export default Artist;

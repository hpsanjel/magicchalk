import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		slug: { type: String, required: true, trim: true, unique: true },
		description: { type: String, default: "" },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

classSchema.pre("validate", function setSlug(next) {
	if (this.name && !this.slug) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	}
	next();
});

export default mongoose.models.Class || mongoose.model("Class", classSchema);

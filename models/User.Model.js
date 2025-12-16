import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		userName: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["parent", "teacher", "admin"], required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User || mongoose.model("User", userSchema);

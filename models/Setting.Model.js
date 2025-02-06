import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
	profilePhoto: String,
	name: { type: String, required: true },
	about: { type: String, required: false },
	address: { type: String, required: false },
	position: { type: String, required: false },
	email: { type: String, required: true, unique: true },
	phone: String,
	mobile: String,
	facebook: String,
	youtube: String,
	instagram: String,
	linkedin: String,
	businessHoursMF: String,
	businessHoursSat: String,
	businessHoursSun: String,
	companyLogo: String,
});

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

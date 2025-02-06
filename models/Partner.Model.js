import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
	{
		partner_name: {
			type: String,
			required: true,
		},
		partner_url: {
			type: String,
			required: true,
		},
		partner_logo: {
			type: String,
			required: true,
		},
		logo_alt_text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema);

export default Partner;

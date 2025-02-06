import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
	{
		eventType: { type: String, required: true },
		companyName: { type: String, required: true },
		address: { type: String, required: true },
		contactName: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		offeredPrice: { type: String, required: true },
		additionalInfo: { type: String },
	},
	{ timestamps: true }
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);

export default Quote;

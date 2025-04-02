import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
	{
		noticetitle: {
			type: String,
			required: true,
			trim: true,
		},
		noticedate: {
			type: String,
			required: true,
			trim: true,
		},
		notice: {
			type: String,
			required: true,
			trim: true,
		},
		noticeimage: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);

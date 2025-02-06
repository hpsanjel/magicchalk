import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "First name is required"],
		minlength: [2, "First name must be at least 2 characters long"],
	},
	lastName: {
		type: String,
		required: [true, "Last name is required"],
		minlength: [2, "Last name must be at least 2 characters long"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
	},
	phone: {
		type: String,
		required: [true, "Phone number is required"],
		minlength: [10, "Phone number must be at least 10 digits long"],
	},
	country: {
		type: String,
		required: [true, "Country is required"],
	},
	message: {
		type: String,
		required: [true, "Message is required"],
		minlength: [10, "Message must be at least 10 characters long"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);

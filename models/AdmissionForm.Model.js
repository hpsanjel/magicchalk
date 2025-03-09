// models/AdmissionForm.js
import mongoose from "mongoose";

const AdmissionFormSchema = new mongoose.Schema({
	// Child Information
	childName: {
		type: String,
		required: [true, "Child's name is required"],
	},
	dob: {
		type: Date,
		required: [true, "Date of birth is required"],
	},
	gender: {
		type: String,
		required: [true, "Gender is required"],
		enum: ["male", "female", "other"],
	},
	photoUrl: {
		type: String,
		required: [true, "Child's photo is required"],
	},

	// Parent/Guardian Information
	parentName: {
		type: String,
		required: [true, "Parent/Guardian name is required"],
	},
	relationship: {
		type: String,
		required: [true, "Relationship to child is required"],
		enum: ["mother", "father", "grandparent", "legal-guardian", "other"],
	},
	email: {
		type: String,
		required: [true, "Email address is required"],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
	},
	phone: {
		type: String,
		required: [true, "Phone number is required"],
	},
	address: {
		type: String,
		required: [true, "Home address is required"],
	},

	// Additional Information
	allergies: {
		type: String,
		default: "",
	},
	emergencyContact: {
		type: String,
		required: [true, "Emergency contact information is required"],
	},
	comments: {
		type: String,
		default: "",
	},

	// Metadata
	submittedAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "approved", "rejected"],
	},
});

// Prevent duplicate models in Next.js development
const AdmissionForm = mongoose.models.AdmissionForm || mongoose.model("AdmissionForm", AdmissionFormSchema);

export default AdmissionForm;

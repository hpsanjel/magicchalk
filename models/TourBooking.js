// models/TourBooking.js
import mongoose from "mongoose";

const tourBookingSchema = new mongoose.Schema({
	// Parent/Guardian Information
	parentFirstName: {
		type: String,
		required: [true, "First name is required"],
		trim: true,
	},
	parentLastName: {
		type: String,
		required: [true, "Last name is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
		lowercase: true,
		match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
	},
	phone: {
		type: String,
		required: [true, "Phone number is required"],
		trim: true,
	},

	// Child Information
	childFirstName: {
		type: String,
		required: [true, "Child's first name is required"],
		trim: true,
	},
	childLastName: {
		type: String,
		required: [true, "Child's last name is required"],
		trim: true,
	},
	childDob: {
		type: Date,
		required: [true, "Child's date of birth is required"],
	},
	currentSchool: {
		type: String,
		trim: true,
	},

	// Tour Preferences
	preferredDate: {
		type: Date,
		required: [true, "Preferred tour date is required"],
	},
	preferredTime: {
		type: String,
		required: [true, "Preferred tour time is required"],
		enum: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
	},
	alternateDate: {
		type: Date,
	},
	alternateTime: {
		type: String,
		enum: ["", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
	},

	// Additional Information
	questions: {
		type: String,
		trim: true,
	},

	// Status
	status: {
		type: String,
		enum: ["pending", "confirmed", "completed", "cancelled"],
		default: "pending",
	},

	// Metadata
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	confirmedDate: {
		type: Date,
	},
	confirmedTime: {
		type: String,
	},
	confirmationSent: {
		type: Boolean,
		default: false,
	},
	reminderSent: {
		type: Boolean,
		default: false,
	},
});

// Update timestamp when document is updated
tourBookingSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// Create model only if it doesn't already exist
export default mongoose.models.TourBooking || mongoose.model("TourBooking", tourBookingSchema);

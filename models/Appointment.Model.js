import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
	// Customer information
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true,
	},

	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
		lowercase: true,
		match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
	},

	phone: {
		type: String,
		required: [true, "Phone number is required"],
		trim: true,
	},

	// Appointment details
	date: {
		type: Date,
		required: [true, "Appointment date is required"],
	},

	time: {
		type: String,
		required: [true, "Appointment time is required"],
		trim: true,
	},

	// Optional additional fields
	notes: {
		type: String,
		trim: true,
	},

	status: {
		type: String,
		enum: ["scheduled", "completed", "cancelled", "no-show"],
		default: "scheduled",
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
});

// Add indexes for faster queries
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ status: 1 });

// Update the updatedAt timestamp before saving
appointmentSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

// Create a virtual property for the full date and time
appointmentSchema.virtual("dateTime").get(function () {
	const date = new Date(this.date);
	return `${date.toDateString()} at ${this.time}`;
});

// Method to check if an appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function () {
	return this.status === "scheduled";
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function () {
	const now = new Date();
	return this.find({
		date: { $gte: now },
		status: "scheduled",
	}).sort({ date: 1, time: 1 });
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function (startDate, endDate) {
	return this.find({
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	}).sort({ date: 1, time: 1 });
};

// Create the model
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;

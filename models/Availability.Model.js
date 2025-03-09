import mongoose from "mongoose";

// Define the schema for time slots
const timeSlotSchema = new mongoose.Schema({
	// The time as a string (e.g., "9:00 AM", "2:30 PM")
	time: {
		type: String,
		required: true,
		trim: true,
	},

	// Whether this time slot has been booked
	isBooked: {
		type: Boolean,
		default: false,
	},

	// Optional: Reference to the appointment that booked this slot
	appointment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Appointment",
		default: null,
	},
});

// Define the schema for available dates
const availabilitySchema = new mongoose.Schema({
	// The date for which time slots are available
	date: {
		type: Date,
		required: true,
	},

	// Array of time slots available for this date
	timeSlots: [timeSlotSchema],

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

// Add a compound index for faster lookups by date

// Add a pre-save hook to ensure date is set to midnight (00:00:00)
availabilitySchema.pre("save", function (next) {
	// Set the time to midnight (00:00:00)
	if (this.date) {
		const date = new Date(this.date);
		date.setHours(0, 0, 0, 0);
		this.date = date;
	}

	// Update the updatedAt timestamp
	this.updatedAt = new Date();

	next();
});

// Add a method to check if a specific date has available time slots
availabilitySchema.statics.hasAvailableTimeSlots = async function (date) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const availability = await this.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
		"timeSlots.isBooked": false, // At least one time slot is not booked
	});

	return !!availability;
};

// Add a method to get available time slots for a specific date
availabilitySchema.statics.getAvailableTimeSlots = async function (date) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const availability = await this.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
	});

	if (!availability) {
		return [];
	}

	// Return only the time slots that are not booked
	return availability.timeSlots.filter((slot) => !slot.isBooked);
};

// Add a method to add or update available date with time slots
availabilitySchema.statics.addOrUpdateAvailableDate = async function (date, timeSlots) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	// Format the time slots
	const formattedTimeSlots = timeSlots.map((time) => ({
		time,
		isBooked: false,
	}));

	// Try to find an existing record for this date
	const existingAvailability = await this.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
	});

	if (existingAvailability) {
		// Update existing record
		existingAvailability.timeSlots = formattedTimeSlots;
		existingAvailability.updatedAt = new Date();
		return await existingAvailability.save();
	} else {
		// Create a new record
		return await this.create({
			date: startOfDay,
			timeSlots: formattedTimeSlots,
		});
	}
};

// Create the model
const Availability = mongoose.models.Availability || mongoose.model("Availability", availabilitySchema);

export default Availability;

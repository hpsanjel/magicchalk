"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability.Model";
import Appointment from "@/models/Appointment.Model";

// Get all available dates
export async function getAvailableDates() {
	await connectDB();

	// Find all dates that have at least one available time slot
	const availableDates = await Availability.find({
		"timeSlots.isBooked": false, // At least one time slot is not booked
	}).sort({ date: 1 });

	return availableDates;
}

// Get available date by date
export async function getAvailableDateByDate(date) {
	await connectDB();

	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const availableDate = await Availability.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
	});

	return availableDate;
}

// Add available date
export async function addAvailableDate(date, timeSlots) {
	await connectDB();

	// Use the static method from the model
	await Availability.addOrUpdateAvailableDate(date, timeSlots);

	revalidatePath("/admin");
	revalidatePath("/book");
}

// Book appointment
export async function bookAppointment(appointmentData) {
	await connectDB();

	// 1. Create the appointment
	const appointment = await Appointment.create(appointmentData);

	// 2. Update the availability to mark the time slot as booked
	const startOfDay = new Date(appointmentData.date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(appointmentData.date);
	endOfDay.setHours(23, 59, 59, 999);

	await Availability.findOneAndUpdate(
		{
			date: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			"timeSlots.time": appointmentData.time,
		},
		{
			$set: {
				"timeSlots.$.isBooked": true,
				"timeSlots.$.appointment": appointment._id,
			},
		}
	);

	revalidatePath("/book");
	revalidatePath("/admin");

	return appointment;
}

// Get all appointments
export async function getAppointments() {
	await connectDB();

	const appointments = await Appointment.find().sort({ date: 1, time: 1 });

	return appointments;
}

// Get upcoming appointments
export async function getUpcomingAppointments() {
	await connectDB();

	const appointments = await Appointment.findUpcoming();

	return appointments;
}

// Cancel appointment
export async function cancelAppointment(appointmentId) {
	await connectDB();

	const appointment = await Appointment.findById(appointmentId);

	if (!appointment) {
		throw new Error("Appointment not found");
	}

	if (!appointment.canBeCancelled()) {
		throw new Error("This appointment cannot be cancelled");
	}

	// Update appointment status
	appointment.status = "cancelled";
	await appointment.save();

	// Free up the time slot
	const startOfDay = new Date(appointment.date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(appointment.date);
	endOfDay.setHours(23, 59, 59, 999);

	await Availability.findOneAndUpdate(
		{
			date: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
			"timeSlots.time": appointment.time,
		},
		{
			$set: {
				"timeSlots.$.isBooked": false,
				"timeSlots.$.appointment": null,
			},
		}
	);

	revalidatePath("/admin");

	return appointment;
}

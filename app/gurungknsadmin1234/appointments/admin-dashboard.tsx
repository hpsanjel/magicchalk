"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import type { Appointment } from "@/lib/models";
import { addAvailableDate } from "@/lib/actions-mongoose"; // Updated import to use Mongoose actions

interface AdminDashboardProps {
	appointments: Appointment[];
}

export default function AdminDashboard({ appointments }: AdminDashboardProps) {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [timeSlots, setTimeSlots] = useState<string[]>(["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]);
	const [newTimeSlot, setNewTimeSlot] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Add time slot
	const handleAddTimeSlot = () => {
		if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
			setTimeSlots([...timeSlots, newTimeSlot]);
			setNewTimeSlot("");
		}
	};

	// Remove time slot
	const handleRemoveTimeSlot = (slot: string) => {
		setTimeSlots(timeSlots.filter((s) => s !== slot));
	};

	// Submit available date - Updated to save to MongoDB
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date) {
			alert("Please select a date");
			return;
		}

		if (timeSlots.length === 0) {
			alert("Please add at least one time slot");
			return;
		}

		setIsSubmitting(true);

		try {
			// Save to MongoDB using the server action
			await addAvailableDate(date, timeSlots);

			alert("Available date added successfully");
			setDate(undefined);
			setTimeSlots(["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]);
		} catch (error) {
			console.error("Error adding available date:", error);
			alert("Failed to add available date");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Format date for display
	const formatAppointmentDate = (date: Date) => {
		try {
			return format(new Date(date), "MMM d, yyyy");
		} catch (error) {
			return "Invalid date" + error;
		}
	};

	return (
		<Tabs defaultValue="appointments">
			<TabsList className="mb-8">
				<TabsTrigger value="appointments">View Appointments</TabsTrigger>
				<TabsTrigger value="availability">Manage Availability</TabsTrigger>
			</TabsList>

			<TabsContent value="appointments">
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Appointments</CardTitle>
						<CardDescription>View and manage all booked appointments</CardDescription>
					</CardHeader>
					<CardContent>
						{appointments.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b">
											<th className="text-left py-3 px-4">Name</th>
											<th className="text-left py-3 px-4">Date</th>
											<th className="text-left py-3 px-4">Time</th>
											<th className="text-left py-3 px-4">Contact</th>
										</tr>
									</thead>
									<tbody>
										{appointments.map((appointment) => (
											<tr key={appointment._id} className="border-b hover:bg-gray-50">
												<td className="py-3 px-4">{appointment.name}</td>
												<td className="py-3 px-4">{formatAppointmentDate(appointment.date)}</td>
												<td className="py-3 px-4">{appointment.time}</td>
												<td className="py-3 px-4">
													<div>{appointment.email}</div>
													<div className="text-sm text-gray-500">{appointment.phone}</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">No appointments found</div>
						)}
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="availability">
				<div className="grid md:grid-cols-2 gap-8">
					<Card>
						<CardHeader>
							<CardTitle>Add Available Date</CardTitle>
							<CardDescription>Select a date and add available time slots</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label>Select Date</Label>
									<Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
								</div>

								<div className="space-y-4">
									<Label>Time Slots</Label>

									<div className="flex flex-wrap gap-2">
										{timeSlots.map((slot) => (
											<div key={slot} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
												<span>{slot}</span>
												<button type="button" onClick={() => handleRemoveTimeSlot(slot)} className="ml-2 text-gray-500 hover:text-red-500">
													×
												</button>
											</div>
										))}
									</div>

									<div className="flex gap-2">
										<Input placeholder="Add time slot (e.g. 2:00 PM)" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} />
										<Button type="button" variant="outline" onClick={handleAddTimeSlot}>
											Add
										</Button>
									</div>
								</div>

								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Saving..." : "Save Available Date"}
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Instructions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>Use this form to add dates and time slots that will be available for booking.</p>
							<ol className="list-decimal list-inside space-y-2">
								<li>Select a date from the calendar</li>
								<li>Add or remove time slots as needed</li>
								<li>Click &quot;Save Available Date&quot; to make these slots available for booking</li>
							</ol>
							<p className="text-sm text-gray-500">Note: If you add a date that already exists, the time slots will be updated.</p>
						</CardContent>
					</Card>
				</div>
			</TabsContent>
		</Tabs>
	);
}

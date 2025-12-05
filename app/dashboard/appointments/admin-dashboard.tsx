"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Mail, Phone, User, Baby, School, MessageSquare, AlertCircle, Trash2, CheckCircle, Search, Download, FileText, Printer } from "lucide-react";
import { addAvailableDate } from "@/lib/actions-mongoose"; // Updated import to use Mongoose actions

interface AdminDashboardProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	appointments: any[]; // Changed from Appointment[] to any[] to accept TourBooking data
	onRefresh?: () => void; // Callback to refresh data
}

export default function AdminDashboard({ appointments = [], onRefresh }: AdminDashboardProps) {
	const { toast } = useToast();
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [timeSlots, setTimeSlots] = useState<string[]>(["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]);
	const [newTimeSlot, setNewTimeSlot] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [processingId, setProcessingId] = useState<string | null>(null);
	const [timeError, setTimeError] = useState("");
	const [existingSlots, setExistingSlots] = useState<string[]>([]);

	// Modal states
	const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [selectedDateOption, setSelectedDateOption] = useState<"preferred" | "alternate">("preferred");

	// Filter states
	const [filterPeriod, setFilterPeriod] = useState<"all" | "week" | "month" | "year" | "custom">("all");
	const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
	const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
	const [searchQuery, setSearchQuery] = useState("");
	const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

	// Filter and search appointments
	const filteredAppointments = useMemo(() => {
		let filtered = [...appointments];

		// Apply date filter
		if (filterPeriod !== "all") {
			const now = new Date();
			let start: Date, end: Date;

			switch (filterPeriod) {
				case "week":
					start = startOfWeek(now, { weekStartsOn: 0 });
					end = endOfWeek(now, { weekStartsOn: 0 });
					break;
				case "month":
					start = startOfMonth(now);
					end = endOfMonth(now);
					break;
				case "year":
					start = startOfYear(now);
					end = endOfYear(now);
					break;
				case "custom":
					if (customStartDate && customEndDate) {
						start = customStartDate;
						end = customEndDate;
					} else {
						return filtered;
					}
					break;
				default:
					return filtered;
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			filtered = filtered.filter((booking: any) => {
				const bookingDate = new Date(booking.preferredDate);
				return isWithinInterval(bookingDate, { start, end });
			});
		}

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			filtered = filtered.filter((booking: any) => {
				const searchText = `${booking.parentFirstName} ${booking.parentLastName} ${booking.childFirstName} ${booking.childLastName} ${booking.email} ${booking.phone} ${booking.status}`.toLowerCase();
				return searchText.includes(query);
			});
		}

		return filtered;
	}, [appointments, filterPeriod, customStartDate, customEndDate, searchQuery]);

	// Export to CSV
	const exportToCSV = () => {
		const headers = ["Parent Name", "Email", "Phone", "Child Name", "Child DOB", "Tour Date", "Tour Time", "Alternate Date", "Alternate Time", "Status", "Questions", "Submitted Date"];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = filteredAppointments.map((booking: any) => [`${booking.parentFirstName} ${booking.parentLastName}`, booking.email, booking.phone, `${booking.childFirstName} ${booking.childLastName}`, formatAppointmentDate(booking.childDob), booking.confirmedDate ? `${formatAppointmentDate(booking.confirmedDate)} (Confirmed)` : formatAppointmentDate(booking.preferredDate), booking.confirmedTime || booking.preferredTime, booking.alternateDate ? formatAppointmentDate(booking.alternateDate) : "N/A", booking.alternateTime || "N/A", booking.status, booking.questions || "N/A", formatAppointmentDate(booking.createdAt)]);

		const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `tour-bookings-${format(new Date(), "yyyy-MM-dd")}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Export to PDF
	const exportToPDF = () => {
		const printWindow = window.open("", "_blank");
		if (!printWindow) return;

		const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Tour Bookings Report - ${format(new Date(), "MMMM d, yyyy")}</title>
				<style>
					body { font-family: Arial, sans-serif; margin: 20px; }
					h1 { color: #16a34a; text-align: center; margin-bottom: 10px; }
					.subtitle { text-align: center; color: #666; margin-bottom: 30px; }
					table { width: 100%; border-collapse: collapse; margin-top: 20px; }
					th { background-color: #16a34a; color: white; padding: 12px; text-align: left; font-weight: bold; }
					td { padding: 10px; border-bottom: 1px solid #ddd; }
					tr:hover { background-color: #f5f5f5; }
					.status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
					.status-pending { background-color: #fef3c7; color: #92400e; }
					.status-confirmed { background-color: #d1fae5; color: #065f46; }
					.status-completed { background-color: #dbeafe; color: #1e40af; }
					.status-cancelled { background-color: #fee2e2; color: #991b1b; }
					@media print {
						body { margin: 0; }
						button { display: none; }
					}
				</style>
			</head>
			<body>
				<h1>Magic Chalk School - Tour Bookings Report</h1>
				<div class="subtitle">Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</div>
				<div class="subtitle">Total Bookings: ${filteredAppointments.length}</div>
				<table>
					<thead>
						<tr>
							<th>Parent Name</th>
							<th>Child Name</th>
							<th>Contact</th>
							<th>Tour Date</th>
							<th>Tour Time</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						${filteredAppointments
							.map(
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								(booking: any) => `
							<tr>
								<td>${booking.parentFirstName} ${booking.parentLastName}</td>
								<td>${booking.childFirstName} ${booking.childLastName}</td>
								<td>${booking.email}<br/>${booking.phone}</td>
								<td>${booking.confirmedDate ? formatAppointmentDate(booking.confirmedDate) + " ✓" : formatAppointmentDate(booking.preferredDate)}</td>
								<td>${booking.confirmedTime || booking.preferredTime}</td>
								<td><span class="status status-${booking.status}">${booking.status}</span></td>
							</tr>
						`
							)
							.join("")}
					</tbody>
				</table>
			</body>
			</html>
		`;

		printWindow.document.write(html);
		printWindow.document.close();
		setTimeout(() => {
			printWindow.print();
		}, 250);
	};

	// Print function
	const handlePrint = () => {
		exportToPDF();
	};

	// Load existing time slots when date is selected
	const loadExistingTimeSlots = async (selectedDate: Date) => {
		try {
			const dateStr = selectedDate.toISOString().split("T")[0];
			const response = await fetch("/api/availability");
			const availabilities = await response.json();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const existing = availabilities.find((avail: any) => {
				const availDate = new Date(avail.date).toISOString().split("T")[0];
				return availDate === dateStr;
			});

			if (existing && existing.timeSlots) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const existingTimes = existing.timeSlots.map((slot: any) => slot.time);
				setExistingSlots(existingTimes);
				// Merge existing slots with current selection
				const mergedSlots = [...new Set([...existingTimes, ...timeSlots])];
				setTimeSlots(mergedSlots.sort());
			} else {
				setExistingSlots([]);
			}
		} catch {
			console.error("Error loading existing time slots:");
		}
	};

	// Handle date selection
	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) {
			loadExistingTimeSlots(selectedDate);
		} else {
			setExistingSlots([]);
		}
	};

	// Validate time format and range
	const validateTimeSlot = (time: string): boolean => {
		// Check format: HH:MM AM/PM
		const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
		if (!timeRegex.test(time)) {
			setTimeError("Invalid format. Use HH:MM AM/PM (e.g., 09:00 AM or 02:30 PM)");
			return false;
		}

		// Parse time to check if it's within allowed range (7:00 AM to 7:00 PM)
		const match = time.match(timeRegex);
		if (!match) return false;

		let hours = parseInt(match[1]);
		const minutes = parseInt(match[2]);
		const period = match[3].toUpperCase();

		// Convert to 24-hour format
		if (period === "PM" && hours !== 12) hours += 12;
		if (period === "AM" && hours === 12) hours = 0;

		const totalMinutes = hours * 60 + minutes;
		const minTime = 7 * 60; // 7:00 AM
		const maxTime = 19 * 60; // 7:00 PM

		if (totalMinutes < minTime || totalMinutes > maxTime) {
			setTimeError("Time must be between 07:00 AM and 07:00 PM");
			return false;
		}

		setTimeError("");
		return true;
	};

	// Add time slot with validation
	const handleAddTimeSlot = () => {
		if (!newTimeSlot.trim()) {
			setTimeError("Please enter a time");
			return;
		}

		// Normalize the time format (ensure proper spacing and capitalization)
		const normalizedTime = newTimeSlot.trim().replace(/\s+/g, " ").toUpperCase();

		if (!validateTimeSlot(normalizedTime)) {
			return;
		}

		if (timeSlots.includes(normalizedTime)) {
			setTimeError("This time slot already exists");
			return;
		}

		setTimeSlots([...timeSlots, normalizedTime]);
		setNewTimeSlot("");
		setTimeError("");
	};

	// Handle Enter key in time input
	const handleTimeInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTimeSlot();
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

			const message = existingSlots.length > 0 ? "Time slots updated successfully! New slots have been added to the existing date." : "Available date added successfully!";
			alert(message);

			setDate(undefined);
			setTimeSlots(["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]);
			setExistingSlots([]);
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
		} catch {
			return "Invalid date";
		}
	};

	// Calculate child age from DOB
	const calculateAge = (dob: Date) => {
		try {
			const today = new Date();
			const birthDate = new Date(dob);
			let age = today.getFullYear() - birthDate.getFullYear();
			const m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		} catch {
			return "N/A";
		}
	};

	// Get status color
	const getStatusColor = (status: string) => {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Confirm booking
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleConfirm = async (bookingId: string, booking: any) => {
		setSelectedBooking(booking);

		if (booking.alternateDate) {
			// Show date selection modal if alternate date exists
			setSelectedDateOption("preferred");
			setShowDateSelectionModal(true);
		} else {
			// Go directly to confirmation if only preferred date
			setShowConfirmationModal(true);
		}
	};

	// Handle date selection confirmation
	const handleDateSelectionConfirm = () => {
		setShowDateSelectionModal(false);
		setShowConfirmationModal(true);
	};

	// Handle final confirmation and send email
	const handleFinalConfirmation = async () => {
		const booking = selectedBooking;
		const selectedDate = selectedDateOption === "preferred" ? booking.preferredDate : booking.alternateDate;
		const selectedTime = selectedDateOption === "preferred" ? booking.preferredTime : booking.alternateTime;

		setShowConfirmationModal(false);
		setProcessingId(booking._id);

		try {
			const response = await fetch("/api/tour-bookings", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: booking._id,
					status: "confirmed",
					confirmedDate: selectedDate,
					confirmedTime: selectedTime,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to confirm booking");
			}

			// Show success toast notification
			toast({
				title: "✅ Booking Confirmed!",
				description: `Tour scheduled for ${formatAppointmentDate(selectedDate)} at ${selectedTime}. Confirmation email sent to parent.`,
				variant: "success",
				duration: 5000,
			});
			onRefresh?.(); // Refresh the data
		} catch (error) {
			console.error("Error confirming booking:", error);
			toast({
				title: "❌ Confirmation Failed",
				description: "Failed to confirm booking. Please try again.",
				variant: "destructive",
				duration: 5000,
			});
		} finally {
			setProcessingId(null);
			setSelectedBooking(null);
		}
	};

	// Mark as completed
	const handleComplete = async (bookingId: string) => {
		if (!confirm("Mark this tour as completed?")) {
			return;
		}

		setProcessingId(bookingId);
		try {
			const response = await fetch("/api/tour-bookings", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: bookingId, status: "completed" }),
			});

			if (!response.ok) {
				throw new Error("Failed to mark as completed");
			}

			alert("Tour marked as completed!");
			onRefresh?.(); // Refresh the data
		} catch (error) {
			console.error("Error marking tour as completed:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setProcessingId(null);
		}
	};

	// Delete booking
	const handleDelete = async (bookingId: string, parentName: string) => {
		if (!confirm(`Are you sure you want to delete the booking for ${parentName}? This action cannot be undone.`)) {
			return;
		}

		setProcessingId(bookingId);
		try {
			const response = await fetch(`/api/tour-bookings?id=${bookingId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete booking");
			}

			alert("Booking deleted successfully!");
			onRefresh?.(); // Refresh the data
		} catch (error) {
			console.error("Error deleting booking:", error);
			alert("Failed to delete booking. Please try again.");
		} finally {
			setProcessingId(null);
		}
	};

	return (
		<>
			<Tabs defaultValue="appointments">
				<TabsList className="mb-8">
					<TabsTrigger value="appointments">View School Tour Bookings</TabsTrigger>
					<TabsTrigger value="availability">Manage Availability</TabsTrigger>
				</TabsList>
				<TabsContent value="appointments">
					<div className="mb-6">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-2xl font-bold">Tour Bookings</h2>
								<p className="text-gray-600">
									Showing {filteredAppointments.length} of {appointments.length} booking(s)
								</p>
							</div>
						</div>

						{/* Filter and Search Bar */}
						<div className="space-y-4 mb-6">
							{/* Period Filters */}
							<div className="flex flex-wrap gap-2">
								<Button size="sm" variant={filterPeriod === "all" ? "default" : "outline"} onClick={() => setFilterPeriod("all")} className={filterPeriod === "all" ? "bg-green-600 hover:bg-green-700" : ""}>
									All
								</Button>
								<Button
									size="sm"
									variant={filterPeriod === "week" ? "default" : "outline"}
									onClick={() => {
										setFilterPeriod("week");
										setShowCustomDatePicker(false);
									}}
									className={filterPeriod === "week" ? "bg-green-600 hover:bg-green-700" : ""}
								>
									This Week
								</Button>
								<Button
									size="sm"
									variant={filterPeriod === "month" ? "default" : "outline"}
									onClick={() => {
										setFilterPeriod("month");
										setShowCustomDatePicker(false);
									}}
									className={filterPeriod === "month" ? "bg-green-600 hover:bg-green-700" : ""}
								>
									This Month
								</Button>
								<Button
									size="sm"
									variant={filterPeriod === "year" ? "default" : "outline"}
									onClick={() => {
										setFilterPeriod("year");
										setShowCustomDatePicker(false);
									}}
									className={filterPeriod === "year" ? "bg-green-600 hover:bg-green-700" : ""}
								>
									This Year
								</Button>
								<Button
									size="sm"
									variant={filterPeriod === "custom" ? "default" : "outline"}
									onClick={() => {
										setFilterPeriod("custom");
										setShowCustomDatePicker(!showCustomDatePicker);
									}}
									className={filterPeriod === "custom" ? "bg-green-600 hover:bg-green-700" : ""}
								>
									<CalendarIcon className="w-4 h-4 mr-1" />
									Custom Range
								</Button>

								{/* Export Buttons */}
								<div className="ml-auto flex gap-2">
									<Button size="sm" variant="outline" onClick={exportToCSV} title="Export to CSV">
										<Download className="w-4 h-4 mr-1" />
										CSV
									</Button>
									<Button size="sm" variant="outline" onClick={exportToPDF} title="Download as PDF">
										<FileText className="w-4 h-4 mr-1" />
										PDF
									</Button>
									<Button size="sm" variant="outline" onClick={handlePrint} title="Print">
										<Printer className="w-4 h-4 mr-1" />
										Print
									</Button>
								</div>
							</div>

							{/* Custom Date Range Picker */}
							{showCustomDatePicker && filterPeriod === "custom" && (
								<Card>
									<CardContent className="pt-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label className="mb-2 block">Start Date</Label>
												<Calendar mode="single" selected={customStartDate} onSelect={setCustomStartDate} className="border rounded-md" />
											</div>
											<div>
												<Label className="mb-2 block">End Date</Label>
												<Calendar mode="single" selected={customEndDate} onSelect={setCustomEndDate} className="border rounded-md" disabled={(date) => !customStartDate || date < customStartDate} />
											</div>
										</div>
										{customStartDate && customEndDate && (
											<div className="mt-4 text-sm text-gray-600">
												Filtering from {format(customStartDate, "MMM d, yyyy")} to {format(customEndDate, "MMM d, yyyy")}
											</div>
										)}
									</CardContent>
								</Card>
							)}

							{/* Search Bar */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input type="text" placeholder="Search by parent name, child name, email, phone, or status..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2" />
								{searchQuery && (
									<button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
										×
									</button>
								)}
							</div>
						</div>
					</div>

					{filteredAppointments.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
							{filteredAppointments.map((booking: any) => (
								<Card key={booking._id} className="hover:shadow-lg transition-shadow">
									{/* Status Bar at Top */}
									<div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
										<Badge className={getStatusColor(booking.status || "pending")}>{booking.status || "pending"}</Badge>
										<Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(booking._id, `${booking.parentFirstName} ${booking.parentLastName}`)} disabled={processingId === booking._id} title="Delete booking">
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>

									<CardHeader className="pb-3">
										<CardTitle className="text-lg flex items-center gap-2">
											<User className="w-5 h-5 text-green-600" />
											{booking.parentFirstName} {booking.parentLastName}
										</CardTitle>
										<CardDescription className="mt-1">Parent/Guardian</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Child Information */}
										<div className="bg-green-50 p-3 rounded-lg space-y-2">
											<div className="flex items-center gap-2 font-semibold text-green-800">
												<Baby className="w-4 h-4" />
												Child Information
											</div>
											<div className="ml-6 space-y-1 text-sm">
												<p className="font-medium">
													{booking.childFirstName} {booking.childLastName}
												</p>
												{booking.childDob && (
													<p className="text-gray-600">
														Age: {calculateAge(booking.childDob)} years
														<span className="text-xs ml-1">({formatAppointmentDate(booking.childDob)})</span>
													</p>
												)}
												{booking.currentSchool && (
													<div className="flex items-center gap-1 text-gray-600">
														<School className="w-3 h-3" />
														<span>{booking.currentSchool}</span>
													</div>
												)}
											</div>
										</div>

										{/* Tour Schedule */}
										<div className="space-y-2">
											{booking.confirmedDate ? (
												<>
													<div className="flex items-center gap-2 text-sm font-semibold text-green-700">
														<CalendarIcon className="w-4 h-4 text-green-600" />
														Confirmed Schedule
													</div>
													<div className="ml-6 bg-green-50 p-2 rounded">
														<p className="text-sm font-bold text-green-800">{formatAppointmentDate(booking.confirmedDate)}</p>
														<p className="text-sm flex items-center gap-1 text-green-700">
															<Clock className="w-3 h-3" />
															{booking.confirmedTime}
														</p>
													</div>
												</>
											) : (
												<>
													<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
														<CalendarIcon className="w-4 h-4 text-blue-600" />
														Preferred Schedule
													</div>
													<div className="ml-6 space-y-1">
														<p className="text-sm">
															<span className="font-medium">Date:</span> {formatAppointmentDate(booking.preferredDate)}
														</p>
														<p className="text-sm flex items-center gap-1">
															<Clock className="w-3 h-3" />
															<span className="font-medium">Time:</span> {booking.preferredTime}
														</p>
														{booking.alternateDate && (
															<div className="mt-2 pt-2 border-t border-gray-200">
																<p className="text-xs text-gray-600">
																	Alternate: {formatAppointmentDate(booking.alternateDate)} at {booking.alternateTime}
																</p>
															</div>
														)}
													</div>
												</>
											)}
										</div>

										{/* Contact Information */}
										<div className="space-y-2 pt-2 border-t">
											<div className="flex items-center gap-2 text-sm">
												<Mail className="w-4 h-4 text-gray-400" />
												<a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline text-sm">
													{booking.email}
												</a>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<Phone className="w-4 h-4 text-gray-400" />
												<a href={`tel:${booking.phone}`} className="text-blue-600 hover:underline">
													{booking.phone}
												</a>
											</div>
										</div>

										{/* Questions/Comments */}
										{booking.questions && (
											<div className="bg-gray-50 p-3 rounded-lg">
												<div className="flex items-start gap-2">
													<MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
													<div className="flex-1">
														<p className="text-xs font-semibold text-gray-700 mb-1">Questions/Comments:</p>
														<p className="text-xs text-gray-600">{booking.questions}</p>
													</div>
												</div>
											</div>
										)}

										{/* Action Buttons */}
										<div className="flex gap-2 pt-2">
											{booking.status !== "completed" ? (
												<>
													<Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleConfirm(booking._id, booking)} disabled={processingId === booking._id || booking.status === "confirmed"}>
														{processingId === booking._id ? "Processing..." : booking.status === "confirmed" ? "Confirmed ✓" : "Confirm & Email"}
													</Button>
													{booking.status === "confirmed" && (
														<Button size="sm" variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => handleComplete(booking._id)} disabled={processingId === booking._id}>
															<CheckCircle className="w-4 h-4 mr-1" />
															Complete
														</Button>
													)}
												</>
											) : (
												<Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled>
													<CheckCircle className="w-4 h-4 mr-1" />
													Completed
												</Button>
											)}
										</div>

										{/* Metadata */}
										<div className="text-xs text-gray-400 pt-2 border-t">Submitted: {formatAppointmentDate(booking.createdAt)}</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
								<p className="text-gray-500 text-lg">No tour bookings found</p>
								<p className="text-gray-400 text-sm mt-2">New bookings will appear here</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>{" "}
				<TabsContent value="availability">
					<div className="grid md:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>Add Available Date</CardTitle>
								<CardDescription>Select a date and add available time slots for school tours</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<Label>Select Date (Today or Future)</Label>
										<Calendar mode="single" selected={date} onSelect={handleDateSelect} className="border rounded-md" disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
										<p className="text-xs text-gray-500">Only today and future dates can be selected</p>
										{existingSlots.length > 0 && (
											<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
												<p className="text-xs font-semibold text-blue-700 mb-1">Existing time slots for this date:</p>
												<div className="flex flex-wrap gap-1">
													{existingSlots.map((slot, idx) => (
														<span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
															{slot}
														</span>
													))}
												</div>
												<p className="text-xs text-blue-600 mt-1">New slots you add will be merged with these.</p>
											</div>
										)}
									</div>

									<div className="space-y-4">
										<Label>Time Slots (07:00 AM - 07:00 PM)</Label>

										<div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50">
											{timeSlots.length > 0 ? (
												timeSlots.map((slot) => (
													<div key={slot} className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm">
														<span className="text-sm font-medium">{slot}</span>
														<button type="button" onClick={() => handleRemoveTimeSlot(slot)} className="ml-2 text-gray-500 hover:text-red-600 font-bold text-lg leading-none">
															×
														</button>
													</div>
												))
											) : (
												<p className="text-sm text-gray-400">No time slots added yet</p>
											)}
										</div>

										<div className="space-y-2">
											<div className="flex gap-2">
												<div className="flex-1">
													<Input
														placeholder="e.g., 09:00 AM or 02:30 PM"
														value={newTimeSlot}
														onChange={(e) => {
															setNewTimeSlot(e.target.value);
															if (timeError) setTimeError("");
														}}
														onKeyPress={handleTimeInputKeyPress}
														className={timeError ? "border-red-500" : ""}
													/>
													{timeError && <p className="text-xs text-red-600 mt-1">{timeError}</p>}
												</div>
												<Button type="button" variant="outline" onClick={handleAddTimeSlot}>
													Add Slot
												</Button>
											</div>
											<p className="text-xs text-gray-500">Format: HH:MM AM/PM (e.g., 09:00 AM, 02:30 PM). Time must be between 07:00 AM and 07:00 PM.</p>
										</div>
									</div>

									<Button type="submit" disabled={isSubmitting || !date || timeSlots.length === 0} className="w-full">
										{isSubmitting ? "Saving..." : "Save Available Date & Times"}
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Instructions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="font-semibold text-green-700">How to add available tour dates:</p>
								<ol className="list-decimal list-inside space-y-2 text-sm">
									<li>Select a date from the calendar (today or any future date)</li>
									<li>
										Add time slots in the format <strong>HH:MM AM/PM</strong>
									</li>
									<li>
										Times must be between <strong>07:00 AM</strong> and <strong>07:00 PM</strong>
									</li>
									<li>Click &quot;Add Slot&quot; to add each time</li>
									<li>Remove unwanted slots by clicking the × button</li>
									<li>Click &quot;Save&quot; to make these times available for booking</li>
								</ol>{" "}
								<div className="mt-4 p-3 bg-blue-50 rounded-lg">
									<p className="text-sm font-semibold text-blue-800 mb-2">Examples of valid times:</p>
									<ul className="text-xs text-blue-700 space-y-1">
										<li>✓ 09:00 AM</li>
										<li>✓ 02:30 PM</li>
										<li>✓ 11:45 AM</li>
										<li>✗ 9 AM (missing minutes)</li>
										<li>✗ 14:00 (use 12-hour format with AM/PM)</li>
										<li>✗ 08:00 PM (after 7:00 PM)</li>
									</ul>
								</div>
								<p className="text-xs text-gray-500 mt-4">
									<strong>Note:</strong> Parents will only be able to select dates and times that you make available here.
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Date Selection Modal */}
			<Dialog open={showDateSelectionModal} onOpenChange={setShowDateSelectionModal}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-green-700">Select Tour Date</DialogTitle>
						<DialogDescription>The parent has provided two date options. Please select which date to confirm for the tour.</DialogDescription>
					</DialogHeader>

					{selectedBooking && (
						<div className="space-y-4 py-4">
							{/* Preferred Date Option */}
							<div onClick={() => setSelectedDateOption("preferred")} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedDateOption === "preferred" ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 hover:border-green-300 hover:bg-gray-50"}`}>
								<div className="flex items-center gap-3">
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDateOption === "preferred" ? "border-green-600" : "border-gray-300"}`}>{selectedDateOption === "preferred" && <div className="w-3 h-3 rounded-full bg-green-600"></div>}</div>
									<div className="flex-1">
										<div className="font-semibold text-gray-900">Preferred Date</div>
										<div className="flex items-center gap-2 mt-1">
											<CalendarIcon className="w-4 h-4 text-gray-500" />
											<span className="text-sm text-gray-700">{formatAppointmentDate(selectedBooking.preferredDate)}</span>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<Clock className="w-4 h-4 text-gray-500" />
											<span className="text-sm text-gray-700">{selectedBooking.preferredTime}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Alternate Date Option */}
							<div onClick={() => setSelectedDateOption("alternate")} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedDateOption === "alternate" ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 hover:border-green-300 hover:bg-gray-50"}`}>
								<div className="flex items-center gap-3">
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDateOption === "alternate" ? "border-green-600" : "border-gray-300"}`}>{selectedDateOption === "alternate" && <div className="w-3 h-3 rounded-full bg-green-600"></div>}</div>
									<div className="flex-1">
										<div className="font-semibold text-gray-900">Alternate Date</div>
										<div className="flex items-center gap-2 mt-1">
											<CalendarIcon className="w-4 h-4 text-gray-500" />
											<span className="text-sm text-gray-700">{formatAppointmentDate(selectedBooking.alternateDate)}</span>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<Clock className="w-4 h-4 text-gray-500" />
											<span className="text-sm text-gray-700">{selectedBooking.alternateTime}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowDateSelectionModal(false)}>
							Cancel
						</Button>
						<Button className="bg-green-600 hover:bg-green-700" onClick={handleDateSelectionConfirm}>
							Continue
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Final Confirmation Modal */}
			<Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
				<DialogContent className="sm:max-w-[450px]">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-green-700">Confirm Tour Booking</DialogTitle>
						<DialogDescription>Please review the tour details before sending the confirmation email.</DialogDescription>
					</DialogHeader>

					{selectedBooking && (
						<div className="py-4">
							<div className="bg-green-50 rounded-lg p-4 space-y-3">
								<div className="flex items-center gap-2">
									<User className="w-5 h-5 text-green-600" />
									<div>
										<div className="text-xs text-gray-600">Parent</div>
										<div className="font-semibold text-gray-900">
											{selectedBooking.parentFirstName} {selectedBooking.parentLastName}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Baby className="w-5 h-5 text-green-600" />
									<div>
										<div className="text-xs text-gray-600">Child</div>
										<div className="font-semibold text-gray-900">
											{selectedBooking.childFirstName} {selectedBooking.childLastName}
										</div>
									</div>
								</div>

								<div className="border-t border-green-200 pt-3 mt-3">
									<div className="flex items-center gap-2 mb-2">
										<CalendarIcon className="w-5 h-5 text-green-600" />
										<div className="text-xs text-gray-600">Confirmed Tour Date</div>
									</div>
									<div className="ml-7">
										<div className="font-bold text-lg text-green-700">{formatAppointmentDate(selectedDateOption === "preferred" ? selectedBooking.preferredDate : selectedBooking.alternateDate)}</div>
										<div className="flex items-center gap-1 mt-1">
											<Clock className="w-4 h-4 text-green-600" />
											<span className="font-semibold text-green-700">{selectedDateOption === "preferred" ? selectedBooking.preferredTime : selectedBooking.alternateTime}</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-200">
									<Mail className="w-4 h-4 text-green-600" />
									<span className="text-sm text-gray-700">{selectedBooking.email}</span>
								</div>
							</div>

							<div className="mt-4 p-3 bg-blue-50 rounded-lg">
								<p className="text-sm text-blue-800">
									<strong>📧 A confirmation email</strong> will be automatically sent to the parent with the tour details.
								</p>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowConfirmationModal(false)}>
							Cancel
						</Button>
						<Button className="bg-green-600 hover:bg-green-700" onClick={handleFinalConfirmation}>
							Confirm & Send Email
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

import { Suspense } from "react";
import AdminDashboard from "@/app/dashboard/appointments/admin-dashboard";
import type { Appointment } from "@/lib/models";

export default async function AdminPage() {
	function getAppointments(): Appointment[] {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const nextWeek = new Date(today);
		nextWeek.setDate(nextWeek.getDate() + 7);

		return [
			{
				_id: "appointment1",
				name: "John Doe",
				email: "john@example.com",
				phone: "555-123-4567",
				date: today,
				time: "9:00 AM",
				createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000), // yesterday
			},
			{
				_id: "appointment2",
				name: "Jane Smith",
				email: "jane@example.com",
				phone: "555-987-6543",
				date: tomorrow,
				time: "10:30 AM",
				createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
			},
			{
				_id: "appointment3",
				name: "Robert Johnson",
				email: "robert@example.com",
				phone: "555-456-7890",
				date: tomorrow,
				time: "2:00 PM",
				createdAt: new Date(today.getTime() - 30 * 60 * 1000), // 30 minutes ago
			},
			{
				_id: "appointment4",
				name: "Sarah Williams",
				email: "sarah@example.com",
				phone: "555-789-0123",
				date: nextWeek,
				time: "11:00 AM",
				createdAt: today,
			},
			{
				_id: "appointment5",
				name: "Michael Brown",
				email: "michael@example.com",
				phone: "555-321-6547",
				date: nextWeek,
				time: "3:30 PM",
				createdAt: today,
			},
		];
	}
	const appointments = await getAppointments();

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

			<Suspense fallback={<div>Loading dashboard...</div>}>
				<AdminDashboard appointments={appointments} />
			</Suspense>
		</div>
	);
}

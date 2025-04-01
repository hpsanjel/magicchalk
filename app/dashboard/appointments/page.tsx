"use client";

import { Suspense } from "react";
import AdminDashboard from "@/app/dashboard/appointments/admin-dashboard";
import useFetchData from "@/hooks/useFetchData";

export default function AdminPage() {
	const { data: tourBookings, error, loading, mutate } = useFetchData("/api/tour-bookings", "tourBookings");

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

			<Suspense fallback={<div>Loading dashboard...</div>}>
				<AdminDashboard appointments={tourBookings} />
			</Suspense>
		</div>
	);
}

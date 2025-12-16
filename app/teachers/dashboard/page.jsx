"use client";

import React, { useState, useMemo } from "react";

const tabs = [
	{ key: "overview", label: "Overview" },
	{ key: "classes", label: "Classes" },
	{ key: "attendance", label: "Attendance" },
	{ key: "assignments", label: "Assignments" },
	{ key: "notices", label: "Notices" },
	{ key: "messages", label: "Messages" },
	{ key: "gallery", label: "Gallery" },
	{ key: "events", label: "Events" },
	{ key: "profile", label: "Profile" },
];

export default function TeacherDashboardPage() {
	const [active, setActive] = useState("overview");
	const activeLabel = useMemo(() => tabs.find((t) => t.key === active)?.label || "Overview", [active]);

	return (
		<div className="min-h-screen bg-gray-50 pt-24">
			<header className="bg-white border-b border-gray-100 shadow-sm">
				<div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-500">Teacher</p>
						<h1 className="text-2xl font-semibold text-gray-900">{activeLabel}</h1>
						<p className="text-sm text-gray-600">Stay current on your classes, parents, and school updates.</p>
					</div>
				</div>
			</header>

			<nav className="bg-white border-b border-gray-100">
				<div className="mx-auto max-w-6xl px-4 overflow-auto">
					<div className="flex gap-2 py-3 min-w-max">
						{tabs.map((tab) => {
							const isActive = tab.key === active;
							return (
								<button key={tab.key} onClick={() => setActive(tab.key)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</nav>

			<main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
				{active === "overview" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">At a glance</h2>
						<p className="text-sm text-gray-700">Upcoming classes, pending messages, and recent notices will appear here.</p>
					</section>
				)}

				{active === "classes" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Classes</h2>
						<p className="text-sm text-gray-700">View assigned classes, roster, and schedules.</p>
					</section>
				)}

				{active === "attendance" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Attendance</h2>
						<p className="text-sm text-gray-700">Mark daily attendance and share absences with parents.</p>
					</section>
				)}

				{active === "assignments" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
						<p className="text-sm text-gray-700">Post homework, resources, and due dates.</p>
					</section>
				)}

				{active === "notices" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Notices</h2>
						<p className="text-sm text-gray-700">Publish class or grade notices for parents.</p>
					</section>
				)}

				{active === "messages" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Messages</h2>
						<p className="text-sm text-gray-700">Respond to parent messages and questions.</p>
					</section>
				)}

				{active === "gallery" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
						<p className="text-sm text-gray-700">Upload classroom photos for families.</p>
					</section>
				)}

				{active === "events" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Events</h2>
						<p className="text-sm text-gray-700">Share upcoming events or field trips with parents.</p>
					</section>
				)}

				{active === "profile" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Profile</h2>
						<p className="text-sm text-gray-700">Update your contact info, bio, and notification preferences.</p>
					</section>
				)}
			</main>
		</div>
	);
}

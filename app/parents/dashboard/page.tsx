"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Bell, MessageSquare, CreditCard, Bus, Images, Home, Info, UserCheck } from "lucide-react";

const stats = [
	{ label: "Notices", value: 4, hint: "Unread" },
	{ label: "Meetings", value: 2, hint: "This week" },
	{ label: "Invoices", value: 1, hint: "Due soon" },
	{ label: "Routes", value: 3, hint: "Active" },
];

const notices = [
	{ id: 1, title: "Winter break schedule", date: "Dec 18, 2025", type: "Academic" },
	{ id: 2, title: "Immunization reminder", date: "Dec 22, 2025", type: "Health" },
	{ id: 3, title: "Science fair signup", date: "Jan 10, 2026", type: "Event" },
];

const meetings = [
	{ id: 1, title: "Parent-teacher conference", date: "Dec 20, 2025", time: "10:30 AM", status: "Confirmed" },
	{ id: 2, title: "Counselor check-in", date: "Jan 04, 2026", time: "2:00 PM", status: "Pending" },
];

const invoices = [
	{ id: 1, label: "Tuition - January", amount: "$1,200", due: "Jan 05, 2026", status: "Due" },
	{ id: 2, label: "Cafeteria - December", amount: "$95", due: "Dec 28, 2025", status: "Paid" },
];

const galleries = [
	{ id: 1, label: "Winter concert", count: 24 },
	{ id: 2, label: "Classroom moments", count: 18 },
];

const routes = [
	{ id: 1, name: "Route A", stop: "Maple St.", time: "7:45 AM" },
	{ id: 2, name: "Route B", stop: "Pine Ave.", time: "8:05 AM" },
	{ id: 3, name: "Route C", stop: "Oak Blvd.", time: "8:20 AM" },
];

export default function ParentsDashboardPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-500">Welcome back</p>
						<h1 className="text-2xl font-semibold text-gray-900">Parents Dashboard</h1>
						<p className="text-sm text-gray-500">Stay on top of notices, meetings, invoices, and transport.</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 transition">
							<CalendarDays className="h-4 w-4" />
							Book Meeting
						</button>
						<button className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 transition">
							<Bell className="h-4 w-4" />
							Alerts
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
				<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((item) => (
						<div key={item.label} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
							<p className="text-sm text-gray-500">{item.label}</p>
							<div className="mt-2 flex items-end gap-2">
								<span className="text-2xl font-semibold text-gray-900">{item.value}</span>
								<span className="text-xs text-green-600">{item.hint}</span>
							</div>
						</div>
					))}
				</section>

				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<div className="rounded-xl bg-white border border-gray-100 shadow-sm">
							<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-blue-600" />
									<h2 className="text-base font-semibold text-gray-900">Recent Notices</h2>
								</div>
								<Link href="#" className="text-sm text-green-700 hover:underline">
									View all
								</Link>
							</div>
							<ul className="divide-y divide-gray-100">
								{notices.map((notice) => (
									<li key={notice.id} className="px-4 py-3 flex items-start justify-between">
										<div>
											<p className="text-sm font-semibold text-gray-900">{notice.title}</p>
											<p className="text-xs text-gray-500">
												{notice.date} · {notice.type}
											</p>
										</div>
										<span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1 border border-blue-100">New</span>
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-xl bg-white border border-gray-100 shadow-sm">
							<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
								<div className="flex items-center gap-2">
									<MessageSquare className="h-4 w-4 text-amber-600" />
									<h2 className="text-base font-semibold text-gray-900">Meetings</h2>
								</div>
								<Link href="#" className="text-sm text-green-700 hover:underline">
									Schedule
								</Link>
							</div>
							<ul className="divide-y divide-gray-100">
								{meetings.map((meeting) => (
									<li key={meeting.id} className="px-4 py-3 flex items-center justify-between">
										<div>
											<p className="text-sm font-semibold text-gray-900">{meeting.title}</p>
											<p className="text-xs text-gray-500">
												{meeting.date} · {meeting.time}
											</p>
										</div>
										<span className={`text-xs rounded-full px-2 py-1 border ${meeting.status === "Confirmed" ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>{meeting.status}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-xl bg-white border border-gray-100 shadow-sm">
							<div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
								<CreditCard className="h-4 w-4 text-purple-600" />
								<h2 className="text-base font-semibold text-gray-900">Invoices</h2>
							</div>
							<ul className="divide-y divide-gray-100">
								{invoices.map((invoice) => (
									<li key={invoice.id} className="px-4 py-3 flex items-center justify-between">
										<div>
											<p className="text-sm font-semibold text-gray-900">{invoice.label}</p>
											<p className="text-xs text-gray-500">Due {invoice.due}</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
											<span className={`text-xs rounded-full px-2 py-1 border ${invoice.status === "Paid" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>{invoice.status}</span>
										</div>
									</li>
								))}
							</ul>
							<div className="px-4 py-3">
								<Link href="#" className="text-sm text-green-700 hover:underline">
									View payment history
								</Link>
							</div>
						</div>

						<div className="rounded-xl bg-white border border-gray-100 shadow-sm">
							<div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
								<Images className="h-4 w-4 text-pink-600" />
								<h2 className="text-base font-semibold text-gray-900">Gallery</h2>
							</div>
							<ul className="divide-y divide-gray-100">
								{galleries.map((gallery) => (
									<li key={gallery.id} className="px-4 py-3 flex items-center justify-between">
										<p className="text-sm font-semibold text-gray-900">{gallery.label}</p>
										<span className="text-xs text-gray-500">{gallery.count} photos</span>
									</li>
								))}
							</ul>
							<div className="px-4 py-3">
								<Link href="#" className="text-sm text-green-700 hover:underline">
									Open gallery
								</Link>
							</div>
						</div>

						<div className="rounded-xl bg-white border border-gray-100 shadow-sm">
							<div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
								<Bus className="h-4 w-4 text-indigo-600" />
								<h2 className="text-base font-semibold text-gray-900">Transport routes</h2>
							</div>
							<ul className="divide-y divide-gray-100">
								{routes.map((route) => (
									<li key={route.id} className="px-4 py-3 flex items-center justify-between">
										<div>
											<p className="text-sm font-semibold text-gray-900">{route.name}</p>
											<p className="text-xs text-gray-500">Stop: {route.stop}</p>
										</div>
										<span className="text-xs text-gray-600">{route.time}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
						<Home className="h-5 w-5 text-teal-600" />
						<div>
							<p className="text-sm font-semibold text-gray-900">Student profile</p>
							<p className="text-xs text-gray-500">View academic and attendance details.</p>
						</div>
					</div>
					<div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
						<UserCheck className="h-5 w-5 text-emerald-600" />
						<div>
							<p className="text-sm font-semibold text-gray-900">Update contacts</p>
							<p className="text-xs text-gray-500">Keep your phone and address current.</p>
						</div>
					</div>
					<div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
						<Bell className="h-5 w-5 text-amber-600" />
						<div>
							<p className="text-sm font-semibold text-gray-900">Notifications</p>
							<p className="text-xs text-gray-500">Control alerts for notices and invoices.</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

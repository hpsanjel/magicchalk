"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Bell, MessageSquare, CreditCard, Bus, Images, Home, Info, UserCheck, X, ChevronLeft, ChevronRight } from "lucide-react";

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
	{ id: 1, label: "Tuition - January", amount: "Rs 12,000", due: "Jan 05, 2026", status: "Due", reference: "INV-2026-001" },
	{ id: 2, label: "Cafeteria - December", amount: "Rs 3,200", due: "Dec 28, 2025", status: "Paid", reference: "INV-2025-234" },
	{ id: 3, label: "Activity Fee - Term 2", amount: "Rs 1,800", due: "Jan 15, 2026", status: "Pending", reference: "INV-2026-019" },
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

type MealKey = "breakfast" | "lunch" | "snack";
type MealItem = { title: string; detail: string };
type MealPlanDay = { day: string } & Record<MealKey, MealItem>;

const mealSlots: { key: MealKey; label: string }[] = [
	{ key: "breakfast", label: "Breakfast" },
	{ key: "lunch", label: "Lunch" },
	{ key: "snack", label: "Afternoon Snack" },
];

const mealPlan: MealPlanDay[] = [
	{
		day: "Monday",
		breakfast: { title: "Oatmeal with berries", detail: "Low sugar, served with milk." },
		lunch: { title: "Grilled chicken, brown rice, veggies", detail: "Includes fruit cup and water." },
		snack: { title: "Yogurt & apple slices", detail: "Nut-free option." },
	},
	{
		day: "Tuesday",
		breakfast: { title: "Scrambled eggs & toast", detail: "Whole grain toast with seasonal fruit." },
		lunch: { title: "Veggie pasta with marinara", detail: "Topped with parmesan, side salad." },
		snack: { title: "Cheese cubes & crackers", detail: "Served with cucumber sticks." },
	},
	{
		day: "Wednesday",
		breakfast: { title: "Banana pancakes", detail: "Made with whole wheat, served with milk." },
		lunch: { title: "Baked fish, quinoa, broccoli", detail: "Lemon dressing on the side." },
		snack: { title: "Hummus & carrot sticks", detail: "Nut-free dip." },
	},
	{
		day: "Thursday",
		breakfast: { title: "Greek yogurt parfait", detail: "Granola and mixed berries." },
		lunch: { title: "Turkey sandwich on wheat", detail: "Lettuce, tomato, and veggie soup." },
		snack: { title: "Trail mix (seed-based)", detail: "Includes raisins and pretzels." },
	},
	{
		day: "Friday",
		breakfast: { title: "Spinach & cheese omelette", detail: "Served with whole fruit." },
		lunch: { title: "Veggie fried rice", detail: "Peas, carrots, egg; low sodium." },
		snack: { title: "Banana bread slice", detail: "Whole grain, low sugar." },
	},
	{
		day: "Saturday",
		breakfast: { title: "Waffles with strawberries", detail: "Light syrup, yogurt on the side." },
		lunch: { title: "Chicken noodle soup", detail: "Served with whole grain roll." },
		snack: { title: "Apple chips & cheese", detail: "Baked chips, mild cheddar." },
	},
];

const GALLERY_PAGE_SIZE = 8;

function toEventDateParts(date?: string): { month: string; day: string } {
	if (!date) return { month: "TBA", day: "" };
	const parsed = new Date(date);
	if (!Number.isNaN(parsed.getTime())) {
		return {
			month: parsed.toLocaleString("en-US", { month: "short" }).toUpperCase(),
			day: parsed.getDate().toString().padStart(2, "0"),
		};
	}
	return { month: date, day: "" };
}

function isUpcomingOrToday(date?: string): boolean {
	if (!date) return false;
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return false;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	parsed.setHours(0, 0, 0, 0);
	return parsed >= today;
}

type GalleryItem = {
	id: string;
	url: string;
	alt?: string;
	category?: string;
	classId?: string;
	classLabel?: string;
};

const sections = [
	{ key: "dashboard", label: "Dashboard" },
	{ key: "children", label: "Child Info" },
	{ key: "notices", label: "Notices" },
	{ key: "appointments", label: "Book Appointment" },
	{ key: "assignments", label: "Assignments" },
	{ key: "reports", label: "Student Report" },
	{ key: "meals", label: "School Meals" },
	{ key: "events", label: "Events" },
	{ key: "gallery", label: "Gallery" },
	{ key: "invoices", label: "Invoices" },
];

export default function ParentsDashboardPage() {
	const [active, setActive] = useState<string>("dashboard");
	const activeLabel = useMemo(() => sections.find((s) => s.key === active)?.label || "Dashboard", [active]);
	const [children, setChildren] = useState<{ id: string; name: string; classGroup?: string | null }[]>([]);
	const [loadingChildren, setLoadingChildren] = useState(false);
	const [childrenError, setChildrenError] = useState("");
	const [noticesData, setNoticesData] = useState<{ id: string; title: string; date: string; body: string }[]>([]);
	const [loadingNotices, setLoadingNotices] = useState(false);
	const [noticesError, setNoticesError] = useState("");
	const [eventsData, setEventsData] = useState<{ id: string; title: string; date?: string; venue?: string; description?: string }[]>([]);
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [eventsError, setEventsError] = useState("");
	const [galleryMedia, setGalleryMedia] = useState<GalleryItem[]>([]);
	const [galleryCategories, setGalleryCategories] = useState<string[]>([]);
	const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>("All");
	const [galleryPage, setGalleryPage] = useState(1);
	const [loadingGallery, setLoadingGallery] = useState(false);
	const [galleryError, setGalleryError] = useState("");
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const fetchChildren = () => {
		let ignore = false;
		const load = async () => {
			setLoadingChildren(true);
			setChildrenError("");
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (!res.ok || !data?.user) {
					throw new Error(data?.error || "Unable to load children");
				}
				if (!ignore) {
					setChildren(Array.isArray(data.user.children) ? data.user.children : []);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load children";
				if (!ignore) {
					setChildrenError(message);
				}
			} finally {
				if (!ignore) setLoadingChildren(false);
			}
		};
		load();
		return () => {
			ignore = true;
		};
	};

	useEffect(() => {
		if (active !== "children") return;
		return fetchChildren();
	}, [active]);

	useEffect(() => {
		if (active !== "notices") return;
		let ignore = false;
		const loadNotices = async () => {
			setLoadingNotices(true);
			setNoticesError("");
			try {
				const res = await fetch("/api/notices");
				const data = await res.json();
				if (!res.ok || !data?.success || !Array.isArray(data.notices)) {
					throw new Error(data?.error || "Unable to load notices");
				}
				if (!ignore) {
					const normalized = data.notices.map((n: any) => ({
						id: n._id,
						title: n.noticetitle,
						date: n.noticedate,
						body: n.notice,
					}));
					setNoticesData(normalized);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load notices";
				if (!ignore) setNoticesError(message);
			} finally {
				if (!ignore) setLoadingNotices(false);
			}
		};
		loadNotices();
		return () => {
			ignore = true;
		};
	}, [active]);

	useEffect(() => {
		if (active !== "gallery") return;
		if (children.length === 0 && !loadingChildren) {
			fetchChildren();
		}
		let ignore = false;
		const loadGallery = async () => {
			setLoadingGallery(true);
			setGalleryError("");
			try {
				const res = await fetch("/api/gallery");
				const data = await res.json();
				if (!res.ok || !data?.success || !Array.isArray(data.gallery)) {
					throw new Error(data?.error || "Unable to load gallery");
				}
				if (!ignore) {
					const expanded = data.gallery.flatMap((item: any) => {
						const mediaItems = Array.isArray(item.media) ? item.media : item.media ? [item.media] : [];
						return mediaItems
							.map((entry: any, idx: number) => {
								const raw = typeof entry === "string" ? entry : entry?.url || entry?.src || entry?.secure_url || "";
								const url = typeof raw === "string" ? raw.trim() : "";
								if (!url) return null;
								return {
									id: `${item._id}-${idx}`,
									url,
									alt: (typeof entry === "object" ? entry?.alt : undefined) || item.alt || item.category || "Classroom photo",
									category: item.category || "Uncategorized",
									classId: item.classId?._id || item.classId || "",
									classLabel: item.classLabel || item.classId?.name || "",
								};
							})
							.filter(Boolean);
					});
					setGalleryMedia(expanded);
					setGalleryCategories(Array.isArray(data.categories) ? data.categories : []);
					setGalleryPage(1);
					setActiveGalleryFilter("All");
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load gallery";
				if (!ignore) setGalleryError(message);
			} finally {
				if (!ignore) setLoadingGallery(false);
			}
		};
		loadGallery();
		return () => {
			ignore = true;
		};
	}, [active]);

	const allowedClassLabels = useMemo(() => {
		const labels = children.map((child) => (child.classGroup ? child.classGroup.toString().trim().toLowerCase() : "")).filter(Boolean);
		return new Set(labels);
	}, [children]);

	useEffect(() => {
		if (active !== "events") return;
		let ignore = false;
		const loadEvents = async () => {
			setLoadingEvents(true);
			setEventsError("");
			try {
				const res = await fetch("/api/events");
				const data = await res.json();
				if (!res.ok || !data?.success || !Array.isArray(data.events)) {
					throw new Error(data?.error || "Unable to load events");
				}
				if (!ignore) {
					const normalized = data.events
						.filter((evt: any) => isUpcomingOrToday(evt.eventdate))
						.sort((a: any, b: any) => new Date(a.eventdate).getTime() - new Date(b.eventdate).getTime())
						.map((evt: any) => ({
							id: evt._id,
							title: evt.eventname,
							date: evt.eventdate,
							venue: evt.eventvenue,
							description: evt.eventdescription,
						}));
					setEventsData(normalized);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load events";
				if (!ignore) setEventsError(message);
			} finally {
				if (!ignore) setLoadingEvents(false);
			}
		};
		loadEvents();
		return () => {
			ignore = true;
		};
	}, [active]);

	const openLightbox = (index: number) => {
		if (lightboxItems.length === 0) return;
		const target = Math.max(0, Math.min(index, lightboxItems.length - 1));
		setLightboxIndex(target);
		setLightboxOpen(true);
	};

	const closeLightbox = () => setLightboxOpen(false);

	const showPrev = () => {
		setLightboxIndex((prev) => {
			if (lightboxItems.length === 0) return 0;
			return (prev - 1 + lightboxItems.length) % lightboxItems.length;
		});
	};

	const showNext = () => {
		setLightboxIndex((prev) => {
			if (lightboxItems.length === 0) return 0;
			return (prev + 1) % lightboxItems.length;
		});
	};

	useEffect(() => {
		if (!lightboxOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setLightboxOpen(false);
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				showPrev();
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				showNext();
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [lightboxOpen]);

	const classScopedGallery = galleryMedia.filter((item) => {
		if (!item.classLabel) return true; // no class tag -> visible to all
		if (allowedClassLabels.size === 0) return false; // class-tagged but no child class known
		return allowedClassLabels.has(item.classLabel.toString().trim().toLowerCase());
	});

	const galleryFilters = React.useMemo(() => {
		const classScopedCategories = Array.from(new Set(classScopedGallery.map((item) => item.category || "Uncategorized")));
		return ["All", ...classScopedCategories];
	}, [classScopedGallery]);

	useEffect(() => {
		if (!galleryFilters.includes(activeGalleryFilter)) {
			setActiveGalleryFilter("All");
			setGalleryPage(1);
		}
	}, [galleryFilters, activeGalleryFilter]);
	const filteredGallery = activeGalleryFilter === "All" ? classScopedGallery : classScopedGallery.filter((item) => item.category === activeGalleryFilter);
	const totalGalleryPages = Math.max(1, Math.ceil(filteredGallery.length / GALLERY_PAGE_SIZE));
	const currentGalleryPage = Math.min(galleryPage, totalGalleryPages);
	const paginatedGallery = filteredGallery.slice((currentGalleryPage - 1) * GALLERY_PAGE_SIZE, currentGalleryPage * GALLERY_PAGE_SIZE);
	const lightboxItems = filteredGallery.length > 0 ? filteredGallery : galleryMedia;

	return (
		<div className="min-h-screen bg-gray-50 pt-28">
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-500">Welcome back</p>
						<h1 className="text-2xl font-semibold text-gray-900">{activeLabel}</h1>
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

			<nav className="bg-white border-b border-gray-100">
				<div className="mx-auto max-w-6xl px-4 overflow-auto">
					<div className="flex gap-2 py-3 min-w-max">
						{sections.map((item) => {
							const isActive = item.key === active;
							return (
								<button key={item.key} onClick={() => setActive(item.key)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
									{item.label}
								</button>
							);
						})}
					</div>
				</div>
			</nav>

			<main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
				{active === "dashboard" && (
					<div>
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
					</div>
				)}

				{active === "children" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Child / Children Info</h2>
							{/* <Link href="/parents/dashboard/students" className="text-sm text-green-700 hover:underline">
								Manage profiles
							</Link> */}
						</div>
						<p className="text-sm text-gray-600">View or update your child’s profile details and contacts.</p>

						{loadingChildren && <div className="text-sm text-gray-500">Loading children...</div>}
						{childrenError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{childrenError}</div>}
						{!loadingChildren && !childrenError && children.length === 0 && <div className="text-sm text-gray-600">No child records found for this account.</div>}

						{children.length > 0 && (
							<div className="grid gap-3 md:grid-cols-2">
								{children.map((child) => (
									<div key={child.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 shadow-sm">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-semibold text-gray-900">{child.name}</p>
												<p className="text-xs text-gray-600">Class: {child.classGroup || "-"}</p>
											</div>
											<Link href={`/parents/dashboard/students/${child.id}`} className="text-xs font-semibold text-green-700 hover:underline">
												View details
											</Link>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				)}

				{active === "notices" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Notices</h2>
						{loadingNotices && <div className="text-sm text-gray-500">Loading notices...</div>}
						{noticesError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{noticesError}</div>}
						{!loadingNotices && !noticesError && noticesData.length === 0 && <div className="text-sm text-gray-600">No notices available.</div>}

						{noticesData.length > 0 && (
							<ul className="divide-y divide-gray-100">
								{noticesData.map((notice) => (
									<li key={notice.id} className="py-3 flex items-start justify-between gap-3">
										<div>
											<p className="text-sm font-semibold text-gray-900">{notice.title}</p>
											<p className="text-xs text-gray-500">{notice.date}</p>
											<p className="text-sm text-gray-700 mt-1 line-clamp-2">{notice.body}</p>
										</div>
										<span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1 border border-blue-100 self-start">New</span>
									</li>
								))}
							</ul>
						)}
					</section>
				)}

				{active === "gallery" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
						<div className="flex items-center justify-between flex-wrap gap-3">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
								<p className="text-sm text-gray-600">Classroom and activity photos shared by teachers.</p>
							</div>
							<span className="text-xs rounded-full bg-gray-100 text-gray-800 px-2 py-1 border border-gray-200">Tap to zoom · Arrows to browse</span>
						</div>

						{galleryFilters.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{galleryFilters.map((filter) => {
									const isActive = activeGalleryFilter === filter;
									return (
										<button
											key={filter}
											onClick={() => {
												setActiveGalleryFilter(filter);
												setGalleryPage(1);
											}}
											className={`rounded-full px-3 py-1 text-xs font-semibold transition ${isActive ? "bg-green-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
										>
											{filter}
										</button>
									);
								})}
							</div>
						)}

						{loadingGallery && <div className="text-sm text-gray-500">Loading photos...</div>}
						{galleryError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{galleryError}</div>}
						{!loadingGallery && !galleryError && filteredGallery.length === 0 && <div className="text-sm text-gray-600">No photos yet. Your child’s classroom uploads will appear here.</div>}

						{filteredGallery.length > 0 && (
							<div className="space-y-3">
								<div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
									{paginatedGallery.map((item) => {
										const globalIndex = filteredGallery.findIndex((g) => g.id === item.id);
										return (
											<button type="button" key={item.id} onClick={() => openLightbox(globalIndex)} className="group relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
												<div className="relative h-32 w-full">
													<Image src={item.url} alt={item.alt || "Classroom photo"} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-200 group-hover:scale-[1.03]" referrerPolicy="no-referrer" unoptimized />
												</div>
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
												<div className="absolute bottom-1 left-1 rounded bg-white/80 px-2 py-0.5 text-[11px] text-gray-700">{item.category || "Photo"}</div>
											</button>
										);
									})}
								</div>

								{totalGalleryPages > 1 && (
									<div className="flex items-center justify-between text-xs text-gray-700">
										<div className="space-x-2">
											<button type="button" onClick={() => setGalleryPage((p) => Math.max(1, p - 1))} disabled={currentGalleryPage === 1} className="rounded-full border border-gray-200 px-3 py-1 disabled:opacity-50">
												Prev
											</button>
											<button type="button" onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))} disabled={currentGalleryPage === totalGalleryPages} className="rounded-full border border-gray-200 px-3 py-1 disabled:opacity-50">
												Next
											</button>
										</div>
										<span>
											Page {currentGalleryPage} of {totalGalleryPages}
										</span>
									</div>
								)}
							</div>
						)}

						{lightboxOpen && lightboxItems[lightboxIndex] && (
							<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
								<div className="relative w-full max-w-4xl">
									<button type="button" onClick={closeLightbox} className="absolute -top-10 right-0 text-white hover:text-gray-200" aria-label="Close gallery viewer">
										<X className="h-6 w-6" />
									</button>
									<div className="relative overflow-hidden rounded-xl bg-black shadow-2xl">
										<div className="relative w-full" style={{ minHeight: "80vh" }}>
											<Image src={lightboxItems[lightboxIndex].url} alt={lightboxItems[lightboxIndex].alt || "Classroom photo"} fill sizes="(max-width: 768px) 90vw, 80vw" className="object-contain bg-black" referrerPolicy="no-referrer" unoptimized />
										</div>
										<div className="absolute inset-y-0 left-0 flex items-center">
											<button type="button" onClick={showPrev} className="p-3 text-white/90 hover:text-white" aria-label="Previous photo">
												<ChevronLeft className="h-6 w-6" />
											</button>
										</div>
										<div className="absolute inset-y-0 right-0 flex items-center">
											<button type="button" onClick={showNext} className="p-3 text-white/90 hover:text-white" aria-label="Next photo">
												<ChevronRight className="h-6 w-6" />
											</button>
										</div>
										<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2 flex items-center justify-between">
											<span>{lightboxItems[lightboxIndex].alt || "Classroom photo"}</span>
											<span className="text-xs text-gray-200">
												{lightboxIndex + 1} / {lightboxItems.length}
											</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{active === "meals" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">School Meals</h2>
								<p className="text-sm text-gray-600">Sample week plan (6 days · Breakfast, Lunch, Snack).</p>
							</div>
							<span className="text-xs rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 border border-yellow-200">Sample</span>
						</div>

						<div className="grid gap-4">
							{mealPlan.map((plan) => (
								<div key={plan.day} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm space-y-3">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs text-gray-500">Day</p>
											<p className="text-sm font-semibold text-gray-900">{plan.day}</p>
										</div>
										<span className="text-[11px] rounded-full bg-gray-100 text-gray-800 px-2 py-1 border border-gray-200">Sample day</span>
									</div>

									<div className="grid gap-3 md:grid-cols-3">
										{mealSlots.map((slot) => (
											<div key={slot.key} className="rounded-md border border-gray-100 bg-gray-50 p-3 space-y-1">
												<p className="text-[11px] text-gray-500 uppercase tracking-wide">{slot.label}</p>
												<p className="text-sm font-semibold text-gray-900">{plan[slot.key].title}</p>
												<p className="text-xs text-gray-600">{plan[slot.key].detail}</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm space-y-2">
							<h3 className="text-base font-semibold text-gray-900">Notes</h3>
							<p className="text-sm text-gray-700">Please notify the school of any allergies. Menu rotates weekly; this is a sample week.</p>
						</div>
					</section>
				)}

				{active === "events" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">Events</h2>
						<p className="text-sm text-gray-600">Upcoming events from the school calendar.</p>

						{loadingEvents && <div className="text-sm text-gray-500">Loading events...</div>}
						{eventsError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{eventsError}</div>}
						{!loadingEvents && !eventsError && eventsData.length === 0 && <div className="text-sm text-gray-600">No events available.</div>}

						{eventsData.length > 0 && (
							<div className="grid gap-3 md:grid-cols-2">
								{eventsData.map((event) => {
									const parts = toEventDateParts(event.date);
									return (
										<div key={event.id} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
											<div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-green-600 to-emerald-500 text-white px-4 py-3 min-w-[88px]">
												<span className="text-xs font-semibold tracking-widest">{parts.month}</span>
												<span className="text-3xl font-bold leading-none">{parts.day || "—"}</span>
											</div>
											<div className="flex-1 space-y-1">
												<div className="flex items-start justify-between gap-2">
													<p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
													<span className="text-[11px] text-gray-500">{event.date || "Date TBA"}</span>
												</div>
												<p className="text-xs text-gray-600">{event.venue || "Venue TBA"}</p>
												{event.description && <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</section>
				)}

				{active === "invoices" && (
					<section className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
								<p className="text-sm text-gray-600">See outstanding and paid items with due dates.</p>
							</div>
							<div className="flex gap-2 text-xs">
								<span className="rounded-full bg-red-50 text-red-700 border border-red-100 px-3 py-1">Outstanding: {invoices.filter((inv) => inv.status !== "Paid").length}</span>
								<span className="rounded-full bg-green-50 text-green-700 border border-green-100 px-3 py-1">Paid: {invoices.filter((inv) => inv.status === "Paid").length}</span>
							</div>
						</div>

						<div className="grid gap-3">
							{invoices.map((invoice) => (
								<div key={invoice.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div className="space-y-1">
										<p className="text-sm font-semibold text-gray-900">{invoice.label}</p>
										<p className="text-xs text-gray-600">Ref: {invoice.reference}</p>
									</div>
									<div className="flex flex-col items-start md:items-end gap-1">
										<p className="text-base font-semibold text-gray-900">{invoice.amount}</p>
										<p className="text-xs text-gray-600">Due {invoice.due}</p>
										<span className={`text-xs rounded-full px-2 py-1 border ${invoice.status === "Paid" ? "bg-green-50 text-green-700 border-green-100" : invoice.status === "Due" ? "bg-red-50 text-red-700 border-red-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>{invoice.status}</span>
									</div>
								</div>
							))}
						</div>

						<div className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">For any billing questions or to request a receipt copy, please contact the school office.</div>
					</section>
				)}
			</main>
		</div>
	);
}

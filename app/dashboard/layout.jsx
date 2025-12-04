"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActiveMenu } from "@/context/ActiveMenuContext";
import { Toaster } from "@/components/ui/toaster";
import { BookImage, MessageCircle, Mail, Settings, GalleryThumbnails, LayoutDashboard, Home, Handshake, ArrowBigLeft, Book, Newspaper, Timer, File, User, LogOut } from "lucide-react";

const menuItems = [
	{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ id: "hero", label: "Hero", icon: LayoutDashboard },
	{ id: "contactmessages", label: "Contact Messages", icon: Book },
	{ id: "appointments", label: "Appointments", icon: Timer },
	{ id: "admissions", label: "Admissions", icon: File },
	{ id: "events", label: "Events", icon: BookImage },
	{ id: "blogs", label: "Blogs", icon: Newspaper },
	{ id: "testimonials", label: "Testimonials", icon: MessageCircle },
	{ id: "gallery", label: "Gallery", icon: GalleryThumbnails },
	{ id: "users", label: "Users", icon: User },
	{ id: "notices", label: "Notices", icon: MessageCircle },
	{ id: "subscribers", label: "Subscribers", icon: Mail },
	{ id: "settings", label: "Profile Settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
	const { activeMenu, setActiveMenu } = useActiveMenu();
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Fetch user info from API
		fetch("/api/auth/me")
			.then((res) => res.json())
			.then((data) => {
				if (data.user) {
					setUser(data.user);
				}
			})
			.catch((err) => console.error("Failed to fetch user:", err));
	}, []);

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/logout", {
				method: "POST",
			});
			if (response.ok) {
				router.push("/");
			}
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="mx-auto flex flex-col md:flex-row h-screen overflow-hidden">
			{/* Sidebar */}
			<div className="hidden md:flex w-64 flex-col bg-slate-800 shadow-lg">
				<div className="flex p-7 flex-shrink-0">
					<Link href="/" className="flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 w-fit px-4 py-2 rounded-full">
						<Home /> <p>Home</p>
					</Link>
				</div>
				<nav className="flex-1 overflow-y-auto no-scrollbar">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.id}
								href={item.id === "dashboard" ? `/${item.id}` : `/dashboard/${item.id}`}
								className={`w-full flex items-center px-4 py-4 text-sm
                  ${activeMenu === item.id ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-slate-200 hover:text-black hover:bg-gray-50"}`}
								onClick={() => setActiveMenu(item.id)}
							>
								<Icon className="w-5 h-5 mr-3" />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="flex items-center  justify-between bg-slate-800 shadow-sm">
					<div className="flex flex-col space-y-1 sm:flex-row sm:items-center p-8">
						{activeMenu !== "dashboard" && (
							<Link href="/dashboard" className="flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 w-fit px-2 py-1 rounded-full md:hidden">
								<ArrowBigLeft />
							</Link>
						)}

						<h2 className="text-xl md:text-2xl font-semibold text-slate-200 sm:ml-8">{menuItems.find((item) => item.id === activeMenu)?.label}</h2>
					</div>
					{user && (
						<div className="flex gap-2 items-center justify-center mr-4">
							<div className="flex p-1 w-10 h-10 md:w-12 md:h-12 bg-red-400 rounded-full items-center justify-center">
								<p className="text-3xl font-bold">{user?.email?.charAt(0).toUpperCase()}</p>
							</div>
							<p className="text-sm mr-4 font-semibold text-slate-200">
								Welcome,
								<br />
								<span className="text-slate-300"> {user?.email || "Guest"}!</span>
							</p>
							<button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 text-sm font-medium" title="Sign Out">
								<LogOut className="w-4 h-4" />
								<span className="hidden md:inline">Sign Out</span>
							</button>
						</div>
					)}
				</header>{" "}
				{/* Content Area */}
				<main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-6 no-scrollbar">{children}</main>
			</div>
			<Toaster />
		</div>
	);
}

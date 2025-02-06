"use client";

import React from "react";
import Link from "next/link";
import { useActiveMenu } from "@/context/ActiveMenuContext";
import { BookImage, MessageCircle, Mail, Settings, GalleryThumbnails, LayoutDashboard, Home, Handshake, ArrowBigLeft, Book, Newspaper } from "lucide-react";
import { useSession } from "next-auth/react";

const menuItems = [
	{ id: "gurungknsadmin1234", label: "Dashboard", icon: LayoutDashboard },
	{ id: "hero", label: "Hero", icon: LayoutDashboard },
	{ id: "quotes", label: "Quotes", icon: Book },
	{ id: "contactmessages", label: "Contact Messages", icon: Book },
	{ id: "events", label: "Events", icon: BookImage },
	{ id: "blogs", label: "Blogs", icon: Newspaper },
	// { id: "artists", label: "Artists", icon: Drama },
	{ id: "testimonials", label: "Testimonials", icon: MessageCircle },
	{ id: "gallery", label: "Gallery", icon: GalleryThumbnails },
	{ id: "partners", label: "Partners", icon: Handshake },
	{ id: "subscribers", label: "Subscribers", icon: Mail },
	{ id: "settings", label: "Profile Settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
	const { activeMenu, setActiveMenu } = useActiveMenu();
	const { data: session } = useSession();

	return (
		<div className="mx-auto mb-12 flex flex-col md:flex-row">
			{/* Sidebar */}
			<div className="hidden md:block w-64 flex-col md:flex-row bg-slate-800 shadow-lg h-screen">
				<div className="flex p-7">
					<Link href="/" className="flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 w-fit px-4 py-2 rounded-full">
						<Home /> <p>Home</p>
					</Link>
				</div>
				<nav className="">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.id}
								href={item.id === "gurungknsadmin1234" ? `/${item.id}` : `/gurungknsadmin1234/${item.id}`}
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
						{activeMenu !== "gurungknsadmin1234" && (
							<Link href="/gurungknsadmin1234" className="flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 w-fit px-2 py-1 rounded-full md:hidden">
								<ArrowBigLeft />
							</Link>
						)}

						<h2 className="text-xl md:text-2xl font-semibold text-slate-200 sm:ml-8">{menuItems.find((item) => item.id === activeMenu)?.label}</h2>
					</div>
					{session && (
						<div className="flex gap-2 items-center justify-center">
							<div className="flex p-1 w-10 h-10 md:w-12 md:h-12 bg-red-400 rounded-full items-center justify-center">
								<p className="text-3xl font-bold">{session?.user?.email?.charAt(0).toUpperCase()}</p>
							</div>
							<p className="text-sm mr-6 md:mr-12 font-semibold text-slate-200">
								Welcome,
								<br />
								<span className="text-slate-300"> {session?.user?.email || "Guest"}!</span>
							</p>
						</div>
					)}
				</header>

				{/* Content Area */}
				<main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-6">{children}</main>
			</div>
		</div>
	);
}

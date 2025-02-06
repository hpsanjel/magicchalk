"use client";
import Link from "next/link";
import { useActiveMenu } from "@/context/ActiveMenuContext";
import { Calendar, MessageSquare, Mail, Image, Settings, Handshake, LayoutDashboard, Book, Newspaper } from "lucide-react";

export default function DashboardGrid() {
	const { setActiveMenu } = useActiveMenu();

	const menuItems = [
		{ name: "Hero", icon: Calendar, href: "/gurungknsadmin1234/hero", id: "hero", color: "bg-blue-900" },
		{ name: "Contact Messages", icon: Book, href: "/gurungknsadmin1234/contactmessages", id: "contactmessages", color: "bg-red-900" },
		{ name: "Quotes", icon: Book, href: "/gurungknsadmin1234/quotes", id: "quotes", color: "bg-red-600" },
		{ name: "Events", icon: Calendar, href: "/gurungknsadmin1234/events", id: "events", color: "bg-purple-500" },
		{ name: "Blogs", icon: Newspaper, href: "/gurungknsadmin1234/blogs", id: "blogs", color: "bg-orange-700" },
		// { name: "Artists", icon: Users, href: "/gurungknsadmin1234/artists", id: "artists", color: "bg-pink-500" },
		{ name: "Testimonials", icon: MessageSquare, href: "/gurungknsadmin1234/testimonials", id: "testimonials", color: "bg-yellow-800" },
		{ name: "Gallery", icon: Image, href: "/gurungknsadmin1234/gallery", id: "gallery", color: "bg-orange-500" },
		{ name: "Partners", icon: Handshake, href: "/gurungknsadmin1234/partners", id: "partners", color: "bg-blue-600" },
		{ name: "Subscribers", icon: Mail, href: "/gurungknsadmin1234/subscribers", id: "subscribers", color: "bg-green-700" },
		{ name: "Profile Settings", icon: Settings, href: "/gurungknsadmin1234/settings", id: "settings", color: "bg-gray-500" },
	];

	return (
		<div className="max-w-[1400px] sm:p-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<Link href="/gurungknsadmin1234" className="md:hidden group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105" onClick={() => setActiveMenu("gurungknsadmin1234")}>
					<div className="bg-green-900 p-6 h-full">
						<div className="flex items-center justify-between">
							<div className="text-slate-200">
								<h2 className="text-xl font-semibold mb-2">Dashboard</h2>
								<p className="text-slate-200/80">View gurungknsadmin1234</p>
							</div>
							<LayoutDashboard className="w-8 h-8 text-slate-200 opacity-80 group-hover:opacity-100 transition-opacity" />
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
				</Link>
				{menuItems.map((item) => (
					<Link key={item.name} href={item.href} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105" onClick={() => setActiveMenu(item.id)}>
						<div className={`${item.color} p-6 h-full`}>
							<div className="flex items-center justify-between">
								<div className="text-slate-200">
									<h2 className="text-xl font-semibold mb-2">{item.name}</h2>
									<p className="text-slate-200/80">View {item.name.toLowerCase()}</p>
								</div>
								<item.icon className="w-8 h-8 text-slate-200 opacity-80 group-hover:opacity-100 transition-opacity" />
							</div>
						</div>
						<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
					</Link>
				))}
			</div>
		</div>
	);
}

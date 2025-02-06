"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Eye, MapPin, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BuyTicketButton } from "@/components/BuyTicketButton";

export default function UpcomingEvents() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [countryFilter, setCountryFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [countries, setCountries] = useState([]);
	const [dates, setDates] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const formatDateWithDay = (dateString) => {
		const date = new Date(dateString);
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const day = days[date.getDay()];
		return `${dateString} (${day})`;
	};

	useEffect(() => {
		// Parse query parameters on the client side
		const queryParams = new URLSearchParams(window.location.search);
		const query = queryParams.get("query") || "";
		setSearchTerm(query);
	}, []);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("/api/events");
				const data = await response.json();

				if (data.success) {
					setEvents(data.events);
					const uniqueCountries = [...new Set(data.events.map((event) => event.eventcountry))];
					const uniqueDates = [...new Set(data.events.map((event) => event.eventdate))];
					setCountries(uniqueCountries);
					setDates(uniqueDates);
				} else {
					console.error("Failed to fetch events:");
				}
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		const currentDate = new Date();

		let filtered = events;

		// Apply time filter
		if (filter === "upcoming") {
			filtered = filtered.filter((event) => new Date(event.eventdate) > currentDate);
		} else if (filter === "past") {
			filtered = filtered.filter((event) => new Date(event.eventdate) <= currentDate);
		}

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter((event) => event.eventname.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		// Apply country filter
		if (countryFilter && countryFilter !== "all_countries") {
			filtered = filtered.filter((event) => event.eventcountry === countryFilter);
		}

		// Apply date filter
		if (dateFilter && dateFilter !== "all_dates") {
			filtered = filtered.filter((event) => event.eventdate === dateFilter);
		}

		setFilteredEvents(filtered);
	}, [filter, searchTerm, events, countryFilter, dateFilter]);

	if (loading) {
		return (
			<section id="events" className="py-8 sm:py-48 bg-gray-100 min-h-screen">
				<div className="container mx-auto px-2 sm:px-4">
					<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
						Loading <span className="text-red-500">Events</span>...
					</h2>

					<div className="flex flex-col gap-6 w-full mb-6 sm:mb-12">
						{/* Skeleton for Search and Filters Section */}
						<div className="flex flex-col sm:flex-row gap-4 w-full items-center sm:justify-between bg-gray-50 p-6 rounded-md animate-pulse">
							{/* Skeleton for Search Input */}
							<div className="h-10 bg-gray-300 rounded-md w-full sm:w-[400px]"></div>

							{/* Skeleton for Buttons Section */}
							<div className="flex flex-wrap gap-2 sm:gap-4 justify-between w-full sm:w-fit">
								<div className="h-10 bg-gray-300 rounded-md w-24"></div>
								<div className="h-10 bg-gray-300 rounded-md w-24"></div>
								<div className="h-10 bg-gray-300 rounded-md w-24"></div>
							</div>

							{/* Skeleton for Filters */}
							<div className="flex flex-wrap gap-4 justify-center sm:justify-end w-full sm:w-auto">
								<div className="h-10 bg-gray-300 rounded-md w-[180px]"></div>
								<div className="h-10 bg-gray-300 rounded-md w-[180px]"></div>
							</div>
						</div>
					</div>

					{/* Skeleton for Events Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-8">
						{Array(8)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="bg-white shadow-md rounded-md overflow-hidden animate-pulse">
									<div className="h-64 bg-gray-300"></div>
									<div className="p-4 space-y-4">
										<div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
										<div className="h-6 bg-gray-300 rounded-md w-full"></div>
										<div className="flex justify-between">
											<div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
											<div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
										</div>
										<div className="flex justify-between">
											<div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
											<div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="events" className="py-8 sm:py-48 bg-gray-100 min-h-screen">
			<div className="container mx-auto px-2 sm:px-4">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Special <span className="text-red-500">Events</span>
				</h2>

				<div className="flex flex-col gap-6 w-full mb-6 sm:mb-12">
					{/* Search and Filters Section */}
					<div className="flex flex-col sm:flex-row gap-4 w-full items-center sm:justify-between bg-gray-50 p-6 rounded-md">
						{/* Search Input */}
						<div className="relative w-full sm:w-[400px]">
							{/* <Input type="text" placeholder="Search events..." onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-1/2 transition-all ease-linear duration-300 focus:w-full focus:outline-none" /> */}
							<Input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-1/2 transition-all ease-linear duration-300 focus:w-full focus:outline-none" />
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>

						{/* Buttons Section */}
						<div className="flex flex-wrap gap-2 sm:gap-4 justify-between w-full sm:w-fit">
							<Button onClick={() => setFilter("all")} variant={filter === "all" ? "default" : "outline"} aria-pressed={filter === "all"}>
								All Events
							</Button>
							<Button onClick={() => setFilter("upcoming")} variant={filter === "upcoming" ? "default" : "outline"} aria-pressed={filter === "upcoming"}>
								Upcoming Events
							</Button>
							<Button onClick={() => setFilter("past")} variant={filter === "past" ? "default" : "outline"} aria-pressed={filter === "past"}>
								Past Events
							</Button>
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-4 justify-center sm:justify-end w-full sm:w-auto">
							{/* Country Filter */}
							<Select value={countryFilter} onValueChange={setCountryFilter}>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Filter by Country" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all_countries">All Countries</SelectItem>
									{countries.map((country) => (
										<SelectItem key={country} value={country}>
											{country}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Date Filter */}
							<Select value={dateFilter} onValueChange={setDateFilter}>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Filter by Date" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all_dates">All Dates</SelectItem>
									{dates.map((date) => (
										<SelectItem key={date} value={date}>
											{formatDateWithDay(date)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{filteredEvents.length > 0 ? (
					<motion.div key="events-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-8">
						{filteredEvents.map((event, index) => (
							<motion.div key={event._id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
								<Card className=" overflow-hidden h-full group">
									<div className="overflow-hidden">
										<Image width={300} height={400} src={event?.eventposterUrl || "/placeholder.jpg"} alt={event?.eventname || "alt"} className="w-full h-96 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
									</div>

									<Link href={`/events/${event?._id}`}>
										<CardHeader>
											<span className=" border-black border-2 rounded-full w-fit px-2 py-1 mb-1 text-black text-xs sm:text-md font-semibold">{event?.eventcountry}</span>
											<CardTitle className="line-clamp-1">{event?.eventname}</CardTitle>
										</CardHeader>
									</Link>
									<CardContent className="">
										<div className="flex justify-between">
											<div className="flex items-center mb-2">
												<Calendar className="h-4 w-4 mr-2 text-primary" />
												<span className="text-sm text-gray-600">{event?.eventdate}</span>
											</div>
											<div className="flex items-center mb-2">
												<Clock className="h-4 w-4 mr-2 text-primary" />
												<span className="text-sm text-gray-600 line-clamp-1">{event?.eventtime} </span>
											</div>
										</div>
										<div className="flex justify-between">
											<div className="flex items-center">
												<MapPin className="h-4 w-4 mr-2 text-primary" />
												<span className="text-sm text-gray-600 line-clamp-1">{event?.eventvenue}</span>
											</div>
											<div className="text-2xl font-bold">{event.eventprice !== "0" && "€" + event.eventprice}</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Link href={`/events/${event?._id}`}>
											<Button variant="secondary" className="hover:bg-slate-200">
												<Eye className="hidden md:block h-4 w-4" />
												View Details
											</Button>
										</Link>
										{new Date(event?.eventdate) > new Date() && <BuyTicketButton eventId={event?.eventname} price={event?.eventprice} />}
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.p key="no-events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-600">
						No events available for this filter combination.
					</motion.p>
				)}
			</div>
		</section>
	);
}

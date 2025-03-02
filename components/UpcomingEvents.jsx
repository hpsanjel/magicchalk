"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, Globe, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BuyTicketButton } from "./BuyTicketButton";
import ShareEvent from "./ShareEvent";
import useFetchData from "@/hooks/useFetchData";
import KindergartenEventsGrid from "@/components/EventCard";
// import DisplayPrices from "@/components/DisplayPrices";

export default function UpcomingEvents() {
	const { data: events, error, loading } = useFetchData("/api/events", "events");

	if (loading) {
		return (
			<section id="events" className="py-12 sm:py-16 bg-gray-100">
				<div className="container mx-auto px-2 sm:px-4">
					<p className="text-3xl font-bold text-center mb-6 sm:mb-12">
						Loading <span className="text-red-500">Event</span>...
					</p>

					{/* Skeleton Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 md:gap-20">
						{/* Skeleton for Event Poster */}
						<div className="col-span-2 h-[500px] bg-gray-200 rounded-lg animate-pulse"></div>

						{/* Skeleton for Event Details */}
						<div className="flex flex-col">
							<div className="w-full h-10 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
							<div className="h-6 w-3/4 bg-gray-300 rounded-lg animate-pulse mb-6"></div>

							<div className="space-y-4">
								<div className="flex justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
										<div className="h-4 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
										<div className="h-4 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
									</div>
								</div>
								<div className="flex justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
										<div className="h-4 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
										<div className="h-4 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
									</div>
								</div>
							</div>

							<div className="flex justify-between items-center mt-6">
								<div className="h-10 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
								<div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
							</div>

							{/* Share and Media */}
							<div className="mt-6">
								<div className="h-6 w-40 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
								<div className="w-full h-36 bg-gray-200 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>

					{/* Skeleton for "View All Events" Button */}
					<div className="flex justify-center mt-8">
						<div className="w-40 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
					</div>
				</div>
			</section>
		);
	}
	if (error) return <p>Error: {error}</p>;

	return (
		<>
			{events?.length > 0 && (
				<section id="events" className="mx-auto py-6 bg-gray-100">
					<div className="px-2 sm:px-4 container mx-auto ">
						<p className="text-3xl font-bold text-center mb-6">
							Upcoming <span className="text-red-500">Events</span>
						</p>

						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className=" flex overflow-x-scroll mx-auto">
							<KindergartenEventsGrid events={events} />
						</motion.div>
					</div>
				</section>
			)}
		</>
	);
}

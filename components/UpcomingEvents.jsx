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
				<section id="events" className="py-12 sm:py-16 bg-gray-100">
					<div className="container mx-auto px-2 sm:px-4">
						<p className="text-3xl font-bold text-center mb-6 sm:mb-12">
							{new Date(events[0]?.eventdate) < new Date() ? "Previous" : "Upcoming"} <span className="text-red-500">Event</span>
						</p>

						<motion.div key="events-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							{events.slice(0, 1).map((event) => (
								<div key={event?._id} className="grid grid-cols-1 lg:grid-cols-3 md:gap-20">
									<motion.div className="grid col-span-2 overflow-hidden" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
										<Image width={400} height={500} src={event?.eventposterUrl || "/placeholder.jpg"} alt={event?.eventname || "alt"} className="w-full h-auto rounded-lg object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
									</motion.div>
									<div className="mt-4 lg:mt-0">
										<Link href={`/events/${event?._id}`} className="flex w-full items-center justify-center bg-black p-4  text-white rounded-lg font-semibold">
											View Event Details
										</Link>
										<div className="mt-6 text-black text-lg font-semibold mb-2">Reserve your seat today</div>
										<Card className=" text-xl overflow-hidden group ">
											<Link href={`/events/${event?._id}`}>
												<CardHeader>
													<CardTitle className="text-lg hover:text-red-700">{event?.eventname}</CardTitle>
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
														<Globe className="h-4 w-4 mr-2 text-primary" />
														<span className="text-sm text-gray-600 line-clamp-1">{event?.eventcountry}</span>
													</div>
													<div className="flex items-center">
														<MapPin className="h-4 w-4 mr-2 text-primary" />
														<span className="text-sm text-gray-600 line-clamp-1">{event?.eventvenue}</span>
													</div>
												</div>
												{/* <DisplayPrices prices={events} /> */}
											</CardContent>
											<CardFooter className="flex justify-end gap-4">
												<div className="text-4xl font-bold">{event.eventprice !== "0" && "€" + event.eventprice}</div>
												{new Date(event?.eventdate) > new Date() ? <BuyTicketButton btnState={false} eventName={event?.eventName} btnText="Add to Cart" /> : <BuyTicketButton btnState={true} eventName={event.eventName} btnText="Add to Cart" />}
											</CardFooter>
										</Card>
										<div className=" text-black text-lg font-semibold mt-6 mb-2">Send to your friends and family</div>

										<ShareEvent title={event.eventname} description={event.eventdescription} startDate={new Date(event.eventdate)} country={event.eventcountry} venue={event.eventvenue} price={event.eventprice} poster={event.eventposterUrl} />
										{event?.eventyoutubeUrl && (
											<div className="w-full mb-6">
												<div className=" text-black mt-6 mb-2 text-lg font-semibold">Relevant Media</div>
												<iframe className="rounded-xl w-full h-60 " src={event?.eventyoutubeUrl || null} title={event.eventname} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
											</div>
										)}
										{event?.eventspotifyUrl && (
											<div className="w-full mt-6">
												<iframe src={event.eventspotifyUrl || null} width="100%" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
											</div>
										)}
									</div>
								</div>
							))}
						</motion.div>

						<Link href="/events">
							<Button variant="default" className="flex justify-center mx-auto mt-8">
								View All Events
							</Button>
						</Link>
					</div>
				</section>
			)}
		</>
	);
}

import Image from "next/image";
import { Calendar, Clock, Globe, MapPin } from "lucide-react";
import ShareEvent from "@/components/ShareEvent";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { BuyTicketButton } from "@/components/BuyTicketButton";
// import { Button } from "@/components/ui/button";
import { BuyTicketButton } from "@/components/BuyTicketButton";

async function getEventDetails(id) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, { cache: "no-store" });
		if (!res.ok) {
			throw new Error("Failed to fetch event");
		}
		return res.json();
	} catch (error) {
		console.error("Error fetching event:", error);
		return null;
	}
}

export default async function EventPage({ params }) {
	const { id } = await params;
	const event1 = await getEventDetails(id);
	const event = event1.event;

	const eventdetails = [
		{ icon: Calendar, label: "Date", value: event.eventdate },
		{ icon: Clock, label: "Time", value: event.eventtime },
		{ icon: Globe, label: "Country", value: event.eventcountry },
		{ icon: MapPin, label: "Venue", value: event.eventvenue },
	];

	if (!event || !event._id) {
		return {
			notFound: true,
		};
	}

	return (
		<div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-36 p-6">
			<main className="flex-grow">
				<h1 className="text-xl md:text-2xl xl:text-4xl font-bold my-8">{event.eventname}</h1>
				<div className="mb-6 relative w-full">
					<Image src={event.eventposterUrl || "/placeholder.jpg"} alt={event.eventname || "alt"} width={500} height={500} className="w-full" />
					<div className="mt-6">
						<h1 className="text-lg lg:text-4xl font-bold my-12">{event.eventname}</h1>
						{event.eventposter2Url && <Image src={event.eventposter2Url || "/placeholder.jpg"} alt={event.eventname || "alt"} width={500} height={500} className="w-full" />}
						<p className="text-md lg:text-lg my-12">{event.eventdescription}</p>
						{event.eventposter3Url && <Image src={event.eventposter3Url || "/placeholder.jpg"} alt={event.eventname || "alt"} width={500} height={500} className="w-full" />}
						{event.eventvideoUrl && (
							<video src={event.eventvideoUrl} alt={event.eventname || "alt"} width={500} height={500} className="w-full" controls>
								Your browser does not support the video tag.
							</video>
						)}{" "}
					</div>
				</div>
			</main>
			<aside className="mt-24 w-full lg:w-1/3 space-y-6 md:space-y-12">
				<div className="bg-slate-100 border border-slate-300 rounded-xl mx-6 py-6">
					<CardTitle className="text-center text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-6">Event Details</CardTitle>
					<div className="grid grid-cols-1 px-6 gap-4 mb-6">
						{eventdetails.map((detail, index) => (
							<Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
								<CardContent className="p-4">
									<div className="flex items-center space-x-3">
										<div className="flex-shrink-0">
											<span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
												<detail.icon className="h-5 w-5 text-primary" />
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-black truncate">{detail.label}</p>
											<p className="text-md text-gray-500 truncate">{detail.value}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="sm:px-6">{new Date(event?.eventdate) > new Date() ? <BuyTicketButton btnState={false} btnText="Get Your Tickets Now" eventId={event?.eventname} price={event?.eventprice} /> : <BuyTicketButton btnState={true} btnText="Get Your Tickets Now" eventId={event?.eventname} price={event?.eventprice} />}</div>
				</div>
				<div className="mx-6">
					<ShareEvent title={event.eventname} description={event.eventdescription} startDate={new Date(event.eventdate)} endDate={new Date(event.eventdate)} />
				</div>{" "}
				<div className="w-full">
					<iframe className="w-full h-72 px-6" src={event.eventyoutubeUrl || null} title={event.eventname} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
				</div>
				<div className="w-full">
					<iframe className="px-6" src={event.eventspotifyUrl || null} width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
				</div>
			</aside>
		</div>
	);
}

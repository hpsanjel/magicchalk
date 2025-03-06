"use client";
import { motion } from "framer-motion";
import useFetchData from "@/hooks/useFetchData";
import KindergartenEventsGrid from "@/components/EventCard";

export default function UpcomingEvents() {
	const { data: events, error, loading } = useFetchData("/api/events", "events");

	if (error) return <p>Error: {error}</p>;

	return (
		<>
			<section id="events" className="mx-auto py-6 bg-gray-100">
				<div className="px-2 sm:px-4 container mx-auto">
					<p className="text-3xl font-bold text-center mb-6">
						Upcoming <span className="text-green-500">Events</span>
					</p>

					{loading ? (
						// ✅ Skeleton Loader (Shimmer Effect)
						<div className="flex gap-4 overflow-x-scroll mx-auto">
							{Array(3)
								.fill(0)
								.map((_, index) => (
									<div key={index} className="w-64 h-40 bg-gray-300 animate-pulse rounded-lg"></div>
								))}
						</div>
					) : (
						// ✅ Render Events (Once Loaded)
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex overflow-x-scroll mx-auto">
							<KindergartenEventsGrid events={events} />
						</motion.div>
					)}
				</div>
			</section>
		</>
	);
}

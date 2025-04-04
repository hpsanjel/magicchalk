"use client";
import TestimonialCard from "./TestimonialCard";
import useFetchData from "@/hooks/useFetchData";

export default function Testimonials() {
	const { data: testimonials, error, loading } = useFetchData("/api/testimonials", "testimonials");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-6">
					What Our Parents <span className="text-green-500">Say</span>
				</h2>
				<div className="w-24 h-1 bg-green-500 mx-auto mb-6 md:mb-12 rounded-full"></div>

				<div className="hidden lg:grid lg:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<TestimonialCard key={testimonial._id} testimonial={testimonial} />
					))}
				</div>
				<div className="lg:hidden flex overflow-x-auto space-x-4 snap-x snap-mandatory no-scrollbar p-2">
					{testimonials.map((testimonial) => (
						<TestimonialCard key={testimonial._id} testimonial={testimonial} />
					))}
				</div>
			</div>
		</section>
	);
}

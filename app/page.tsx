"use client";

import Hero from "@/components/Hero";
import UpcomingEvents from "@/components/UpcomingEvents.jsx";
import About from "@/components/About";
// import Testimonials from "@/components/Testimonials";
// import Newsletter from "@/components/Newsletter";
// import ContactCard from "@/components/ContactCard";
import PartnersSlider from "@/components/PartnersSlider";
import Gallery from "@/components/Gallery";
import Blog from "@/components/Blog";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
			<main>
				<Hero />
				<About />
				<UpcomingEvents />
				<PartnersSlider />
				<Blog />
				{/* <Testimonials /> */}
				{/* <ContactCard /> */}
				<Gallery />
			</main>
		</div>
	);
}

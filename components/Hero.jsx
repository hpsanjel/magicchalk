"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { ArrowDown } from "lucide-react";
import { useCallback } from "react";

export default function Hero() {
	const scrollToNextSection = useCallback(() => {
		console.log("Scroll button clicked");
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth",
		});
	}, []);

	return (
		<section className="relative h-screen flex flex-col justify-between overflow-hidden hero-section">
			{/* Background Image */}
			<div className="absolute inset-0">
				<CldImage src="herokns_tkxtcs" alt="A vibrant festival scene with colorful lights and a festive atmosphere" className="object-cover" fill sizes="100vw" />
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-black opacity-40"></div>
			</div>

			{/* Content */}
			<div className="container max-w-4xl -mt-72 mx-auto px-4 z-10 text-center flex-grow flex flex-col justify-center">
				{/* Heading */}
				<motion.h1 className="text-3xl md:text-5xl font-bold text-slate-200 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
					Create Memories For Every Occasion!
				</motion.h1>

				{/* Subheading */}
				<motion.p className="text-xl text-gray-200 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
					Discover and book thrilling events and the latest Nepali movies today.
				</motion.p>

				{/* Buttons */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
					{/* Explore Events Button */}
					<Link href="/events">
						<Button size="lg" className="hover:bg-slate-300 bg-white text-slate-900 font-bold py-3 px-6 mr-4 rounded-full">
							Explore Events
						</Button>
					</Link>
					{/* Book Event Button */}
					<Link href="/request-a-quote">
						<Button size="lg" className="bg-red-600 hover:bg-red-700 text-slate-200 font-bold py-3 px-6 rounded-full">
							Request a Quote
						</Button>
					</Link>
				</motion.div>
			</div>

			{/* Move Down Button */}
			<motion.button onClick={scrollToNextSection} className="absolute bottom-16 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-transparent ring-2 ring-slate-200 text-white w-12 h-12 rounded-full hidden sm:flex items-center justify-center group hover:bg-white hover:text-slate-900 transition-colors duration-300 cursor-pointer z-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} aria-label="Scroll to next section">
				<ArrowDown className="animate-bounce group-hover:animate-none" />
			</motion.button>
		</section>
	);
}

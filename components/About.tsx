"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import HomeVideo from "@/components/HomeVideo";
import UpcomingEvents from "./UpcomingEvents";

export default function About() {
	return (
		<section id="about" className="my-12 md:my-20 flex items-center justify-center">
			{/* Background image with overlay */}
			{/* <div className="absolute inset-0 ">
				<div className="absolute inset-0 bg-[url('/mc-group.jpeg')] bg-cover bg-center bg-no-repeat"> </div>

				<div className="absolute inset-0 bg-black bg-opacity-50"></div>
			</div> */}

			{/* Content container */}
			<div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 relative z-10">
				<motion.div className="mx-auto bg-white rounded-lg shadow-2xl overflow-hidden" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
					{/* green accent bar */}
					<div className="h-2 bg-green-600 w-full"></div>

					{/* Content with padding */}
					<div className="grid grid-cols-1 md:grid-cols-2">
						<div className="p-8 md:p-12">
							<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
								Welcome to
								<span className="text-green-500 block mt-1"> Magic Chalk Kindergarten</span>
							</h2>

							<div className="space-y-4 text-gray-700">
								<p className="text-lg">At Magic Chalk Kindergarten, we believe that every child is a little artist, ready to explore, create, and grow in a world full of wonder. Our nurturing environment encourages curiosity, creativity, and a love for learning through playful and engaging activities.</p>

								<p className="text-lg">Our mission is to provide a safe and joyful space where children can develop essential social, emotional, and cognitive skills. Through interactive storytelling, hands-on learning, and fun-filled adventures, we inspire young minds to dream big and discover their potential.</p>

								<p className="text-lg">From arts and crafts to music, movement, and early literacy, our carefully designed programs foster a love for exploration while laying a strong foundation for lifelong learning. At Magic Chalk, every day is a new opportunity to learn, imagine, and shine!</p>
							</div>

							<div className="mt-8">
								<Link href="/about-us">
									<Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded transition-colors duration-300 inline-flex items-center group">
										Read More
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</Button>
								</Link>
							</div>
						</div>
						<HomeVideo />
					</div>
				</motion.div>
				<UpcomingEvents />
			</div>
		</section>
	);
}

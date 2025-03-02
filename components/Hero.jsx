"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useCallback } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Hero() {
	const scrollToNextSection = useCallback(() => {
		console.log("Scroll button clicked");
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth",
		});
	}, []);

	return (
		<>
			<Head>
				<title>Magic Chalk Day Care</title>
			</Head>

			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center text-center">
				{/* Background Image */}
				<div className="absolute inset-0">
					<Image src="/magichero.jpeg" alt="Magic Chalk Day Care" layout="fill" objectFit="cover" className="w-full h-full" />
				</div>

				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-50"></div>

				{/* Content */}
				<div className="relative max-w-6xl leading-relaxed z-10 text-white px-6 md:px-12">
					{/* Heading */}
					<motion.h1 className="text-4xl md:text-6xl font-bold mb-4" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
						Welcome to Magic Chalk Day Care and Child Education Center
					</motion.h1>

					{/* Subheading */}
					<motion.p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
						Discover Magic Chalk Day Care and Child Education Center, where parents find the perfect blend of nurturing care and innovative learning for their toddlers.
					</motion.p>

					{/* Buttons */}
					<motion.div className="flex flex-col md:flex-row gap-4 justify-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
						<Link href="/explore">
							<Button className="bg-[#F2A649] text-white px-6 py-3 rounded-lg hover:bg-[#e6963d]">Explore Our School</Button>
						</Link>

						<Link href="/book-tour">
							<Button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300">Book School Tour</Button>
						</Link>
					</motion.div>
				</div>

				{/* Move Down Button */}
				<motion.button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white" onClick={scrollToNextSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
					<ArrowDown className="w-10 h-10 animate-bounce" />
				</motion.button>
			</section>
		</>
	);
}

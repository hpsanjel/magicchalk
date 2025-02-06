import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Film, Mic, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
	const services = [
		{ title: "Concerts", icon: <Music />, description: "Immerse yourself in the power of live music, with performances spanning a variety of genres to captivate every music enthusiast." },
		{ title: "Movie Screenings", icon: <Film />, description: "Experience the magic of cinema in unique settings, featuring classics, indie films, and modern hits." },
		{ title: "Stand-Up Comedy", icon: <Mic />, description: "Laugh out loud with our carefully curated comedy nights, showcasing rising stars and renowned performers." },
	];

	const reasons = [
		{ title: "Memorable Moments", description: "We are dedicated to crafting events that leave a lasting impression on attendees." },
		{ title: "Artist Empowerment", description: "We provide a platform for both emerging talents and seasoned performers to shine." },
		{ title: "Promote Nepali Culture", description: "We promote Nepali culture, tradition all over Europe." },
		{ title: "Community Bonding", description: "Promote interaction, and celebrate diversity, encouraging stronger connections and a relationship within communities." },
	];
	return (
		<div className="pt-20 min-h-screen">
			<main className="container mx-auto px-4 -my-12 py-24">
				<section className="mb-20">
					<Card className="overflow-hidden">
						<CardHeader className="bg-red-700 text-white p-4 md:p-6 px-4">
							<CardTitle className="text-2xl md:text-4xl md:text-center">
								Welcome to Gurung KNS Entertainment <p className="text-lg md:text-xl text-slate-200 mt-1">Your trusted partner for unforgettable event experiences across Europe</p>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4 md:p-12 grid grid-cols-1 md:grid-cols-2 items-center">
							<div className="my-6 md:px-12 w-full">
								<h2 className="text-2xl md:text-4xl font-bold mb-4">
									About <span className="text-red-500 leading-tight">Us</span>
								</h2>
								<p className="text-lg mb-6">KNS Entertainment is a premier event management company dedicated to bringing the vibrant culture of Nepal to audiences across Europe. With a focus on organizing unforgettable cultural programs and concerts, we showcase the best Nepalese artists and their performances.</p>
								<p className="text-lg mb-8">From traditional music and dance to contemporary fusion performances, we offer a diverse range of events that celebrate the rich heritage of Nepal while embracing modern artistic expressions.</p>
								<p className="text-lg mb-8">We are a passionate team of event planners, creators, and industry experts united by a shared commitment to excellence. With diverse talents and a keen eye for detail, we craft immersive experiences that resonate with audiences and exceed expectations.</p>
							</div>{" "}
							<div className="md:px-12">
								<Image src="/kns_logo_rect.png" alt="Event Experience" width={200} height={200} className="rounded-lg shadow-lg w-full" />
							</div>
						</CardContent>
					</Card>
				</section>

				<section className="h-auto bg-black">
					<div className="text-center text-white p-8 py-20 lg:px-32">
						<h2 className="text-2xl md:text-4xl font-bold mb-4">
							Our <span className="text-red-500 leading-tight">Vision</span>
						</h2>{" "}
						<p className="text-lg mb-4">To redefine the event industry by delivering innovative, memorable, and impactful experiences. We aim to provide a platform where artists thrive, audiences connect, and creativity shines, setting new benchmarks for excellence in entertainment.</p>
					</div>
				</section>

				<section className="my-20">
					<h2 className="text-2xl md:text-4xl font-bold mb-8 text-center">
						What We <span className="text-red-500 leading-tight">Do</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-16">
						{services.map((service, index) => (
							<Card key={index} className="overflow-hidden">
								<CardHeader className="bg-red-700 text-white p-4 lg:px-8">
									<CardTitle className="flex items-center text-xl">
										{service.icon}
										<span className="ml-2">{service.title}</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="p-4  lg:px-8">
									<p>{service.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="bg-slate-100 text-slate-800 p-8 my-16 rounded-lg">
					<h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">
						Why Choose <span className="text-red-600 leading-tight">Us</span>
					</h2>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
						{reasons.map((reason, index) => (
							<li key={index} className="flex space-y-4 items-start">
								<Sparkles className="mr-2 mt-4 text-red-500" />
								<div>
									<h3 className="font-semibold text-red-600">{reason.title}</h3>
									<p>{reason.description}</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				<section className="my-6 md:my-16 h-auto bg-red-700 rounded-lg">
					<div className="text-center text-black p-8">
						<p className="text-xl text-white md:text-3xl mb-8">So, are you ready to request a quote?</p>
						<Link href="request-a-quote" className="border-b bg-black hover:bg-red-900 rounded-full py-4 px-12 text-white font-bold">
							Request Now
						</Link>{" "}
					</div>
				</section>
			</main>
		</div>
	);
}

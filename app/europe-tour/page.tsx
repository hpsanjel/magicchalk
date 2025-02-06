import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EuropeTourPage() {
	return (
		<div className="flex flex-col min-h-screen pt-32">
			<main className="flex-grow container mx-auto py-8">
				<section className="mb-12">
					<h1 className="text-4xl font-bold mb-4">Europe Tour</h1>
					<p className="text-lg mb-4">We as KNS, are constantly pushing the boundaries of creativity, innovation, and excellence in event scene in Europe. Our upcoming projects showcase our dedication to delivering unforgettable experiences that leave a lasting impression. We invite fellow event planners from Europe to join us in bringing these visions to life.</p>
					<Link href="/request-a-quote">
						<Button>Request a Quote</Button>
					</Link>
				</section>
				<section className="mb-12">
					<h2 className="text-3xl font-bold mb-4  lg:mt-16">HIGHLIGHTS OF 2025</h2>
					<p className="text-xl font-semibold mb-8">EVENTFUL YEAR IS AWAITING !!</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<EventCard title="ABA HASCHHA EUROPE – 2024" description="GRAND SUCCESSFUL TOUR OF 2024." imageUrl="/event1.png" />
						<EventCard title="TAYARI EUROPE TOUR – 2025" description="STAY TUNED WITH MAMA EVENTS FOR MORE UPDATE!!" imageUrl="/event3.png" />
						<EventCard title="KABITA CONCERT 2025" description="STAY TUNED WITH MAMA EVENTS FOR MORE UPDATE!!" imageUrl="/event4.png" />
					</div>
				</section>

				<section className="my-12 lg:my-16">
					<h3 className="text-2xl font-bold mb-4 text-center">We Accept</h3>
					<div className="flex justify-center space-x-4">
						<Image src="/payment_method.webp" className="w-full lg:w-1/2" alt="Payment Methods" width={650} height={10} />
					</div>
				</section>
			</main>
		</div>
	);
}

function EventCard({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Image src={imageUrl || "/placeholder.svg"} alt={title} width={300} height={200} className="mb-4 w-full" />
				<p>{description}</p>
			</CardContent>
		</Card>
	);
}

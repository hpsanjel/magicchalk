import { Card, CardContent } from "@/components/ui/card";

export default function Notices() {
	const notices = [
		{
			title: "School Reopening",
			date: "March 15, 2025",
			description: "We are excited to welcome students back to school for the new academic year! Please ensure all necessary school supplies are ready.",
		},
		{
			title: "Parent-Teacher Meeting",
			date: "March 22, 2025",
			description: "A parent-teacher meeting will be held to discuss students' progress and upcoming activities. We encourage all parents to attend.",
		},
		{
			title: "Spring Picnic",
			date: "April 5, 2025",
			description: "Join us for a fun-filled picnic at the city park. There will be games, food, and activities for children and parents!",
		},
	];

	return (
		<div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
			<div className="container max-w-6xl mx-auto px-4 pt-32 pb-20">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold mb-4">
						School <span className="text-green-500">Notices</span>
					</h1>
					<div className="w-24 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">Stay updated with the latest announcements, events, and important notices for our kindergarten community.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{notices.map((notice, index) => (
						<Card key={index} className="shadow-lg border-none bg-white">
							<div className="bg-green-500 h-1"></div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-green-600 mb-2">{notice.title}</h3>
								<p className="text-gray-500 text-sm mb-2">{notice.date}</p>
								<p className="text-gray-700">{notice.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

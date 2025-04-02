import { Card, CardContent } from "@/components/ui/card";
import useFetchData from "@/hooks/useFetchData";

export default function Notices() {
	const { data: notices } = useFetchData("/api/notices", "notices");

	return (
		<div className="bg-gradient-to-b from-green-50 to-white">
			<div className="container max-w-6xl mx-auto px-4 py-20">
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
								<h3 className="text-xl font-bold text-green-600 mb-2">{notice.noticetitle}</h3>
								<p className="text-gray-500 text-sm mb-2">{notice.noticedate}</p>
								<p className="text-gray-700">{notice.notice}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

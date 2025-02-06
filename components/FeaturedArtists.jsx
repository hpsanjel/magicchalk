import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Facebook, Instagram, Play, User, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturedArtists() {
	const [artists, setArtists] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArtists = async () => {
			try {
				const response = await fetch("/api/artists");
				const data = await response.json();

				if (data.success) {
					setArtists(data.artists);
				} else {
					console.error("Failed to fetch artists:", data.error);
				}
			} catch (error) {
				console.error("Error fetching artists:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchArtists();
	}, []);

	if (loading) {
		return <p>Loading artists...</p>;
	}
	return (
		<section id="artists" className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Featured <span className="text-red-500">Artists</span>
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
					{artists.map((artist) => (
						<motion.div key={artist._id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							<Card className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
								{/* Hero Section with Image Overlay */}
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
									<Image width={300} height={300} src={artist.image || "/placeholder.jpg"} alt={artist.name || "alt"} className="w-full h-32 md:h-72 object-cover transition-transform duration-500 hover:scale-105" />
									<div className="absolute bottom-1 sm:bottom-4 left-4 z-20">
										<h2 className="text-sm sm:text-xl md:text-2xl font-bold text-slate-200">{artist.name}</h2>
										<Badge className="text-xs md:text-sm lg:text-md bg-red-500 text-slate-200 mb-1">{artist.genre}</Badge>
									</div>
								</div>

								<CardContent className="p-3 md:p-6">
									{/* Stats Section */}
									<div className="hidden sm:grid grid-cols-3 gap-4 mb-6">
										<div className="text-center p-3 bg-gray-50 rounded-lg">
											<User className="w-5 h-5 mx-auto mb-1 text-red-500" />
											<p className="text-lg font-bold">{artist.performanceCount}</p>
											<p className="text-xs text-gray-600">Performances</p>
										</div>
										<div className="text-center p-3 bg-gray-50 rounded-lg">
											<Music className="w-5 h-5 mx-auto mb-1 text-red-500" />
											<p className="text-lg font-bold">{artist.totalsongs}</p>
											<p className="text-xs text-gray-600">Songs</p>
										</div>
										<div className="text-center p-3 bg-gray-50 rounded-lg">
											<Play className="w-5 h-5 mx-auto mb-1 text-red-500" />
											<p className="text-lg font-bold">{artist.rating}</p>
											<p className="text-xs text-gray-600">Rating</p>
										</div>
									</div>

									{/* Bio Section */}
									<div className="mb-4 sm:mb-6">
										<p className="text-gray-700 text-sm sm:text-md lg:text-lg leading-normal sm:leading-relaxed line-clamp-2">{artist.bio}</p>
									</div>

									{/* Popular Songs Section */}
									<div className="hidden sm:block mb-6">
										<h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Songs</h3>
										<div className="flex flex-wrap gap-2">
											{artist?.popularSongs.map((song) => (
												<Link key={song} href={`https://open.spotify.com/search/${encodeURIComponent(song)}`} target="_blank" rel="noopener noreferrer">
													<Badge className="cursor-pointer text-black font-thin bg-secondary/20 hover:bg-secondary">
														<Music className="w-4 h-4 text-primary mr-2 text-red-600" />
														{song}
													</Badge>
												</Link>
											))}
										</div>
									</div>

									{/* Social Media Section */}
									<div className="flex flex-row w-full space-x-1">
										{artist.socialMedia.facebook && (
											<Button variant="outline" size="sm" className="sm:flex-1" onClick={() => window.open(artist.socialMedia.facebook, "_blank")}>
												<Facebook className="w-4 h-4 sm:mr-2" />
											</Button>
										)}
										{artist.socialMedia.instagram && (
											<Button variant="outline" size="sm" className="sm:flex-1" onClick={() => window.open(artist.socialMedia.instagram, "_blank")}>
												<Instagram className="w-4 h-4 sm:mr-2" />
											</Button>
										)}
										<Button variant="outline" size="sm" className="sm:flex-1" onClick={() => window.open(artist.socialMedia.instagram, "_blank")}>
											<Youtube className="w-4 h-4 sm:mr-2" />
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Fullscreen } from "lucide-react";
import useFetchData from "@/hooks/useFetchData";

export default function Gallery() {
	const [activeFilter, setActiveFilter] = useState("All");
	const [zoomedItem, setZoomedItem] = useState(null);
	const galleryRef = useRef(null);
	const { data: gallery, error, loading } = useFetchData("/api/gallery", "gallery");

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (zoomedItem && !event.target.closest(".zoomed-image")) {
				setZoomedItem(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [zoomedItem]);

	const filteredItems = activeFilter === "All" ? gallery : gallery.filter((item) => item.category === activeFilter);

	const scrollToSection = (filter) => {
		setActiveFilter(filter);
	};

	const filters = ["All", ...new Set(gallery.map((item) => item.category))];

	if (loading) {
		return (
			<section id="gallery" className="py-12 sm:py-16 bg-gray-100">
				<div className="container mx-auto px-2 sm:px-4">
					<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
						Loading <span className="text-green-500">Gallery</span>...
					</h2>

					{/* Skeleton Filter Buttons */}
					<div className="flex flex-wrap justify-center gap-4 mb-8">
						{Array(4)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="w-20 h-8 bg-gray-300 rounded-full animate-pulse"></div>
							))}
					</div>

					{/* Skeleton Gallery Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array(8)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="relative overflow-hidden rounded-lg shadow-lg bg-gray-200 animate-pulse h-[300px]"></div>
							))}
					</div>
				</div>
			</section>
		);
	}
	if (error) return <p>Error: {error}</p>;

	return (
		<section id="gallery" className="py-12 sm:py-16 bg-gray-100">
			<div className="container mx-auto px-2 sm:px-4">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					<span className="text-green-500">Gallery</span>
				</h2>
				;{/* Filter Buttons */}
				<div className="flex flex-wrap justify-center gap-4 mb-8">
					{filters.map((filter) => (
						<button key={filter} onClick={() => scrollToSection(filter)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${activeFilter === filter ? "bg-green-700 text-slate-200" : "bg-white text-slate-800 hover:bg-green-100"}`}>
							{filter}
						</button>
					))}
				</div>
				{/* Gallery Grid */}
				<div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredItems.length > 0 ? (
						filteredItems.flatMap((item) =>
							item.media.map((image, index) => (
								<div key={`${item._id}-${index}`} className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 p-2 bg-white">
									<div className="group cursor-zoom-in" onClick={() => setZoomedItem({ ...item, media: [image] })}>
										<Image src={image} alt={item.alt || `Gallery image ${index + 1}`} width={400} height={400} className="w-full h-auto aspect-[4/3] object-cover rounded-lg" />
										<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
											<Fullscreen className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</div>
									</div>
								</div>
							))
						)
					) : (
						<span className="text-blue-900 text-center">Currently, this section has no gallery items.</span>
					)}
				</div>
				{/* Zoomed Image */}
				{zoomedItem && (
					<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
						<div className="relative zoomed-image max-w-4xl max-h-full">
							<Image src={zoomedItem.media[0] || "/placeholder.jpg"} alt={zoomedItem.alt || "alt"} width={500} height={500} className="w-full h-full object-contain" />
							<button onClick={() => setZoomedItem(null)} className="absolute top-4 right-4 text-slate-200 text-2xl">
								&times;
							</button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

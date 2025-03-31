"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Fullscreen } from "lucide-react";
import useFetchData from "@/hooks/useFetchData";

export default function Gallery() {
	const [activeFilter, setActiveFilter] = useState("All");
	const [zoomedItem, setZoomedItem] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 4;
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
	const allImages = filteredItems.flatMap((item) => item.media.map((image) => ({ image, item })));
	const totalPages = Math.ceil(allImages.length / itemsPerPage);
	const paginatedItems = allImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	// const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

	// const paginatedItems = filteredItems.flatMap((item) => item.media).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleFilterChange = (filter) => {
		setActiveFilter(filter);
		setCurrentPage(1); // Reset to first page on filter change
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	if (loading) return <p>Loading Gallery...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<section id="gallery" className="py-6 sm:py-16 bg-gray-100">
			<div className="container mx-auto px-2 sm:px-4">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Project <span className="text-green-500">Gallery</span>
				</h2>

				{/* Filter Buttons */}
				<div className="flex flex-wrap justify-center gap-4 mb-6">
					{["All", ...new Set(gallery.map((item) => item.category))].map((filter) => (
						<button key={filter} onClick={() => handleFilterChange(filter)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${activeFilter === filter ? "bg-green-700 text-slate-200" : "bg-white text-slate-800 hover:bg-green-100"}`}>
							{filter}
						</button>
					))}
				</div>

				{/* Gallery Grid with Pagination */}
				<div ref={galleryRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
					{paginatedItems.map(({ image, item }, index) => (
						<div key={`${item._id}-${index}`} className="relative overflow-hidden rounded-lg shadow-lg p-2 bg-white">
							<div className="group cursor-zoom-in" onClick={() => setZoomedItem({ ...item, media: [image] })}>
								<Image src={image} alt={item.alt || `Gallery image ${index + 1}`} width={400} height={400} className="w-full h-auto aspect-[4/3] object-cover rounded-lg" />
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
									<Fullscreen className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Pagination Controls */}
				{totalPages > 0 && (
					<div className="flex justify-center items-center gap-4 mt-6">
						<button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50">
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50">
							Next
						</button>
					</div>
				)}

				{/* Zoomed Image Modal */}
				{zoomedItem && (
					<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
						<div className="relative zoomed-image max-w-6xl">
							<Image src={zoomedItem.media[0] || "/placeholder.jpg"} alt={zoomedItem.alt || "alt"} width={700} height={700} className="w-full h-full object-contain" />
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

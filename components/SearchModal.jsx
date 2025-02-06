import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchModal({ closeModal }) {
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		closeModal();
		if (typeof window !== "undefined") {
			router.push(`/events?query=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
			<button onClick={closeModal} className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-white">
				✕
			</button>
			<form onSubmit={handleSearch} className="max-w-4xl flex items-center gap-4">
				<input type="text" ref={searchInputRef} className="border-b border-red-700 bg-transparent p-8 text-2xl md:text-6xl text-white focus:outline-none" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} required />
				<button type="submit" className=" bg-red-700 rounded-full w-fit p-4 ">
					<Search className="text-white w-12 h-12" />
				</button>
			</form>
		</div>
	);
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SearchModal from "@/components/SearchModal";
import { usePathname } from "next/navigation";

interface HeaderProps {
	isMenuOpen: boolean;
	toggleMenu: () => void;
}

export default function Header({ isMenuOpen, toggleMenu }: HeaderProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const pathname = usePathname();

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.header className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-green-700"}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
			<div className="container mx-auto p-4 flex justify-between items-center">
				<Link href="/" className="flex items-center space-x-4 cursor-pointer group">
					<Image src="/magicchalklogo.png" alt="KNS Entertainment" width={200} height={200} className="w-auto h-12 md:h-16 rounded-md bg-slate-900 group-hover:bg-slate-100" />
				</Link>

				<div className="flex gap-6 items-center">
					<nav className="hidden md:flex items-center space-x-6">
						<Link href="/blogs" className={` border-b border-transparent hover:border-b hover:border-b-yellow-400 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"} ${pathname === "/blogs" ? "border-b-2 border-green-700" : ""}`}>
							Blog
						</Link>
						<Link href="/about-us" className={`border-b border-transparent hover:border-b hover:border-b-yellow-400 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"} ${pathname === "/about-us" ? "border-b-2 border-green-700" : ""}`}>
							About Us
						</Link>
						<Link href="/contact" className={`border-b border-transparent hover:border-b hover:border-b-yellow-400 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"} ${pathname === "/contact" ? "border-b-2 border-green-700" : ""}`}>
							Contact Us
						</Link>
						<Link href="/dashboard" className={`border-b border-transparent hover:border-b hover:border-b-yellow-400 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"} ${pathname === "/contact" ? "border-b-2 border-green-700" : ""}`}>
							Login
						</Link>
					</nav>
				</div>

				<div className="flex gap-4 md:gap-6 items-center">
					{isModalOpen && <SearchModal closeModal={closeModal} />}

					<button onClick={openModal} className=" border-b border-transparent hover:border-b hover:scale-110">
						<span className={`border-b border-transparent hover:border-b hover:border-b-red-700 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"}`}>
							<Search />
						</span>
					</button>
					<Link href="https://www.facebook.com/Magicchalk2023" className={`border-b border-transparent hover:border-b hover:scale-110 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"}`}>
						<Facebook />
					</Link>
					<Link href="https://www.instagram.com/magic_chalk_edu/" className={`border-b border-transparent hover:border-b hover:scale-110 ${isScrolled ? "text-black " : "text-white hover:text-slate-100"}`}>
						<Instagram />
					</Link>

					<div className="md:hidden cursor-pointer ml-10" onClick={toggleMenu}>
						{isMenuOpen ? <X className={`${isScrolled ? "text-black " : "text-slate-700"}`} style={{ height: "32px", width: "32px" }} /> : <Menu className={`${isScrolled ? "text-black " : "text-white"}`} style={{ height: "32px", width: "32px" }} />}
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<motion.div className="md:hidden bg-green-700" initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ duration: 0.1 }}>
					<div className="fixed right-0 w-full h-full bg-green-700">
						<nav className="flex flex-col items-center text-xl font-semibold py-24">
							<NavLink href="/dashboard" onClick={toggleMenu}>
								Dashboard
							</NavLink>
							<NavLink href="/gallery" onClick={toggleMenu}>
								Project Gallery
							</NavLink>

							<NavLink href="/blogs" onClick={toggleMenu}>
								Blogs{" "}
							</NavLink>
							<NavLink href="/about-us" onClick={toggleMenu}>
								About Us
							</NavLink>
							<NavLink href="/contact" onClick={toggleMenu}>
								Contact Us
							</NavLink>
							<div className="mt-12 text-slate-300 text-center">
								<p className="text-md underline">For Admission Enquiry</p>
								<p>Call: 01-5454294</p>
							</div>
						</nav>
					</div>
				</motion.div>
			)}
		</motion.header>
	);
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
	return (
		<a href={href} className="text-gray-300 hover:bg-slate-100 w-full text-center hover:text-red-600 transition-colors duration-300 py-2" onClick={onClick}>
			{children}
		</a>
	);
}

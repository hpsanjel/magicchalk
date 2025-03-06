"use client";
import { Facebook, Instagram, MapPin, Mail, Phone } from "lucide-react";
// import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
	// const { data: settings, error, loading } = useFetchData("/api/settings", "settings");

	// if (loading) return <p>Loading...</p>;
	if (error) return <p>Loading failed{error}</p>;

	return (
		<footer className="bg-gradient-to-b from-gray-900 to-black text-white">
			{/* Wave Separator */}
			{/* <div className="relative">
				<svg className="w-full h-12 fill-current text-white" preserveAspectRatio="none" viewBox="0 0 1440 74">
					<path d="M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440,74 L0,74 Z"></path>
				</svg>
			</div> */}

			{/* Main Footer Content */}
			<div className="container mx-auto px-6 py-12">
				{/* Logo and Tagline */}
				<div className="flex flex-col items-center mb-12">
					<div className=" shadow-lg mb-4">
						<Image src="/magicchalklogo.png" alt="Event Experience" width={100} height={100} className="rounded-lg shadow-xl w-[150px] h-auto object-cover" />
					</div>
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Magic Chalk</h2>
					<p className="text-gray-400 text-center max-w-md">Day Care and Child Education Center</p>
				</div>

				{/* Three Column Layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
					{/* About Column */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">About Us</h3>
						<p className="text-gray-300 leading-relaxed">Discover Magic Chalk Day Care and Child Education Center, where parents find the perfect blend of nurturing care and innovative learning for their toddlers.</p>
					</div>

					{/* Social Links Column */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">Follow Us</h3>
						<div className="flex space-x-3">
							<a href="https://www.facebook.com/Magicchalk2023" target="_blank" className="bg-gray-800 hover:bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">
								<Facebook className="h-5 w-5" />
							</a>
							<a href="https://www.instagram.com/magic_chalk_edu/" target="_blank" className="bg-gray-800 hover:bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">
								<Instagram className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Contact Column */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">Contact Details</h3>
						<div className="space-y-3">
							<div className="flex items-start space-x-3">
								<MapPin className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
								<p className="text-gray-300">Satdobato, Lalitpur</p>
							</div>

							<div className="flex items-center space-x-3">
								<Mail className="h-5 w-5 text-green-400 flex-shrink-0" />
								<a href="mailto:magicchalk.edu@gmail.com" className="text-gray-300 hover:text-green-400 transition-colors">
									magicchalk.edu@gmail.com
								</a>
							</div>

							<div className="flex items-center space-x-3">
								<Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
								<a href="tel:+9771-5454294" className="text-gray-300 hover:text-green-400 transition-colors">
									+977 1-5454294
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Links Row */}
				<div className="pt-8 border-t border-gray-800">
					<nav className="mb-6">
						<ul className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
							<li className="text-gray-400 hover:text-white transition-colors text-sm">
								<Link href="/terms-and-conditions">Terms And Conditions</Link>
							</li>
							<li className="text-gray-400 hover:text-white transition-colors text-sm">
								<Link href="/privacy-policy">Privacy Policy</Link>
							</li>
							<li className="text-gray-400 hover:text-white transition-colors text-sm">
								<Link href="/cancellation-refund-policy">Cancellation & Refund Policy</Link>
							</li>
							<li className="text-gray-400 hover:text-white transition-colors text-sm">
								<Link href="/pay-with-employee-benefits">Pay With Employee Benefits</Link>
							</li>
						</ul>
					</nav>

					{/* Copyright */}
					<div className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} Magic Chalk Day Care and Child Education Center. All rights reserved.</div>
				</div>
			</div>
		</footer>
	);
}

// "use client";
// import { Facebook, Instagram } from "lucide-react";
// import useFetchData from "@/hooks/useFetchData";
// import Link from "next/link";

// export default function Footer() {
// 	const { data: settings, error, loading } = useFetchData("/api/settings", "settings");

// 	if (loading) return <p>Loading...</p>;
// 	if (error) return <p>Loading failed{error}</p>;
// 	return (
// 		<footer className="bg-black text-slate-200 p-4 sm:p-12 md:p-16">
// 			<div className="container mx-auto px-4">
// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
// 					<div className="max-w-sm">
// 						<h3 className="text-xl font-bold mb-4">Magic Chalk Day Care and Child Education Center</h3>
// 						<p className="text-gray-200">Discover Magic Chalk Day Care and Child Education Center, where parents find the perfect blend of nurturing care and innovative learning for their toddlers.</p>
// 					</div>
// 					<div className="">
// 						<div>
// 							<h3 className="text-xl font-bold mb-4">Follow Us</h3>
// 							<div className="flex space-x-4">
// 								<a href={`${settings?.[0]?.facebook}`} target="_blank" className="text-gray-400 hover:text-blue-200 transition-colors">
// 									<Facebook className="h-6 w-6" />
// 								</a>
// 								<a href={`${settings?.[0]?.instagram}`} target="_blank" className="text-gray-400 hover:text-purple-200 transition-colors">
// 									<Instagram className="h-6 w-6" />
// 								</a>
// 							</div>
// 						</div>
// 					</div>
// 					<div className=" text-white rounded-lg shadow-lg md:ml-24 max-w-md  mt-6 md:mt-0">
// 						<h4 className="text-xl font-bold mb-4">Contact Details</h4>
// 						<div className="space-y-1">
// 							<p className="text-lg font-medium">Magic Chalk Day Care and Child Education Center</p>
// 							<p className=" text-gray-200">Satdobato, Lalitpur</p>
// 							<p className=" hover:text-green-400 transition-colors cursor-pointer">
// 								<a href="mailto:gurungkns19@gmail.com">magicchalk.edu@gmail.com</a>
// 							</p>
// 							<p className=" text-gray-200 hover:text-green-400 transition-colors cursor-pointer">
// 								<a href="tel:+4745921405">+977 1-5454294</a>
// 							</p>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="container mx-auto flex flex-col md:text-center mt-12 pt-6 border-t border-gray-600 text-gray-400">
// 					<nav className=" text-gray-400">
// 						<ul className="flex flex-wrap gap-x-6 md:justify-center">
// 							<li className="hover:text-white">
// 								<Link href="/terms-and-conditions">Terms And Conditions</Link>
// 							</li>
// 							<li className="hover:text-white">
// 								<Link href="/privacy-policy">Privacy Policy</Link>
// 							</li>
// 							<li className="hover:text-white">
// 								<Link href="/cancellation-refund-policy">Cancellation & Refund Policy</Link>
// 							</li>
// 							<li className="hover:text-white">
// 								<Link href="/pay-with-employee-benefits">Pay With Employee Benefits</Link>
// 							</li>
// 						</ul>
// 					</nav>
// 					<p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Magic Chalk Day Care and Child Education Center. All rights reserved.</p>
// 				</div>
// 			</div>
// 		</footer>
// 	);
// }

import useFetchData from "@/hooks/useFetchData";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";

const PartnersSlider = () => {
	const { data: partners, error, loading } = useFetchData("/api/partners", "partners");

	if (loading) {
		return (
			<section className="py-16 px-4 sm:py-24 bg-gray-100">
				<div className="container mx-auto max-w-7xl">
					<h2 className="text-3xl font-bold text-center mb-12 sm:mb-16 md:text-4xl lg:text-5xl">
						Loading <span className="text-red-500">Schools</span>...
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
						{/* Skeleton Cards */}
						{Array(6)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="bg-white shadow-md rounded-md overflow-hidden animate-pulse">
									<div className="aspect-video bg-gray-300 rounded-t-md flex items-center justify-center"></div>
									<div className="p-4 sm:p-6">
										<div className="h-4 bg-gray-300 rounded-md w-3/4 mx-auto mb-2"></div>
										<div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto"></div>
									</div>
								</div>
							))}
					</div>
				</div>
			</section>
		);
	}
	if (error) return <p className="text-center py-12 text-red-500">Error: {error}</p>;

	return (
		<section className=" py-16 px-4 sm:py-24">
			<div className="container mx-auto max-w-7xl">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Our <span className="text-red-500">Schools</span>
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
					{/* {partners?.map((logo) => (
						<Card key={logo._id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden">
							<CardContent className="p-4 sm:p-6">
								<a href={logo.partner_url} className="block" target="_blank" rel="noopener noreferrer">
									<div className="aspect-video relative mb-4 rounded-md overflow-hidden flex items-center justify-center">
										<Image src={logo.partner_logo || "/placeholder.jpg"} alt={logo.logo_alt_text || "Partner logo"} width={200} height={100} className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 max-w-full max-h-full" onClick={handlePartnerLogoClick} title={logo.logo_alt_text} />
									</div>
									<h3 className="text-sm sm:text-base font-medium text-gray-900 text-center truncate">{logo.partner_name}</h3>
								</a>
							</CardContent>
						</Card>
					))} */}
					<Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden">
						<CardContent className="py-6">
							<a href="ds" className="block" target="_blank" rel="noopener noreferrer">
								<div className="  mb-4 rounded-md overflow-hidden flex items-center justify-center">
									<img src="pre.jpeg" alt="Preschool" className="object-contain transition-transform duration-300 group-hover:scale-105 max-w-full max-h-full" />
								</div>
								<h3 className="text-sm sm:text-base font-medium text-gray-900 text-center truncate">Pre-school</h3>
							</a>
						</CardContent>
					</Card>
					<Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden">
						<CardContent className="py-6">
							<a href="ds" className="block" target="_blank" rel="noopener noreferrer">
								<div className="  mb-4 rounded-md overflow-hidden flex items-center justify-center">
									<img src="nur.jpeg" alt="Preschool" className="object-contain transition-transform duration-300 group-hover:scale-105 max-w-full max-h-full" />
								</div>
								<h3 className="text-sm sm:text-base font-medium text-gray-900 text-center truncate">Nursery</h3>
							</a>
						</CardContent>
					</Card>
					<Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white overflow-hidden">
						<CardContent className="py-6">
							<a href="ds" className="block" target="_blank" rel="noopener noreferrer">
								<div className=" mb-4 rounded-md overflow-hidden flex items-center justify-center">
									<img src="lkg.jpeg" alt="Preschool" className="object-contain transition-transform duration-300 group-hover:scale-105 w-full max-w-full max-h-full" />
								</div>
								<h3 className="text-sm sm:text-base font-medium text-gray-900 text-center truncate">LKG</h3>
							</a>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default PartnersSlider;

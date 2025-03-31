import Image from "next/image";
import React from "react";

const programs = [
	{
		title: "Early Childhood Development",
		ageGroup: "2-4 years",
		description: "Focuses on sensory activities, motor skills, and basic socialization.",
		image: "/ec.avif",
		color: "bg-blue-50",
	},
	{
		title: "Preschool Learning",
		ageGroup: "4-5 years",
		description: "Introduces letters, numbers, storytelling, and creative play.",
		image: "/ps.avif",
		color: "bg-green-50",
	},
	{
		title: "Kindergarten Readiness",
		ageGroup: "5-6 years",
		description: "Prepares children for primary school with structured learning and problem-solving skills.",
		image: "/kg.avif",
		color: "bg-indigo-50",
	},
];

const ViewPrograms = () => {
	return (
		<div className="container mx-auto pt-32 p-6 max-w-7xl">
			<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Programs</h1>

			<div className="w-24 h-1 bg-green-500 mx-auto mb-6 md:mb-12 rounded-full"></div>

			<div className="mt-16">
				{programs.map((program, index) => (
					<div key={index} className={`flex flex-col lg:flex-row items-center mb-16 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
						{/* Image container */}
						<div className={`w-full lg:w-1/2 p-4 ${program.color} rounded-lg transition-all duration-300 hover:shadow-lg`}>
							<div className="relative">
								<Image src={program.image} alt={program.title} width={400} height={400} className="w-full h-96 object-cover rounded-lg shadow-md" />
							</div>
						</div>

						{/* Content container */}
						<div className="w-full lg:w-1/2 p-8 md:p-12">
							<h3 className="text-2xl font-semibold mb-3 text-gray-800">{program.title}</h3>

							<div className="inline-block bg-green-500 text-white rounded-md px-4 py-1 mb-4 font-medium text-sm">Age Group: {program.ageGroup}</div>

							<p className="text-gray-700 text-lg leading-relaxed bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400">{program.description}</p>

							{/* Button */}
							<button className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded-md px-5 py-2 font-medium transition-all duration-300 flex items-center">
								Learn More
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ViewPrograms;

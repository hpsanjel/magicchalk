import React from "react";

const programs = [
	{
		title: "Early Childhood Development",
		ageGroup: "2-4 years",
		description: "Focuses on sensory activities, motor skills, and basic socialization.",
	},
	{
		title: "Preschool Learning",
		ageGroup: "4-5 years",
		description: "Introduces letters, numbers, storytelling, and creative play.",
	},
	{
		title: "Kindergarten Readiness",
		ageGroup: "5-6 years",
		description: "Prepares children for primary school with structured learning and problem-solving skills.",
	},
];

const ViewPrograms = () => {
	return (
		<div className="container mx-auto pt-32 p-6 max-w-5xl">
			<h1 className="text-3xl font-bold text-center mb-8">Our Programs</h1>
			<div className="w-24 h-1 bg-green-500 mx-auto mb-6 md:mb-12 rounded-full"></div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{programs.map((program, index) => (
					<div key={index} className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300">
						<h3 className="text-xl font-semibold mb-2">{program.title}</h3>
						<p className="text-gray-600 mb-2 font-medium">Age Group: {program.ageGroup}</p>
						<p className="text-gray-700">{program.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ViewPrograms;

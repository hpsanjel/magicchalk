import React from "react";

const EventCard = ({ date, title }) => {
	// Parse the date
	const eventDate = new Date(date);
	const formattedDay = eventDate.getDate();
	const monthName = eventDate.toLocaleString("default", { month: "short" });

	return (
		<div className="flex flex-col justify-between bg-[#f6f9ea] hover:bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 h-64 w-64">
			<div className="w-20 h-20 bg-[#97BF06] rounded-lg flex flex-col items-center justify-center">
				<span className="text-5xl font-bold text-slate-800">{formattedDay}</span>
				<span className="text-sm text-slate-700 uppercase">{monthName}</span>
			</div>
			<div>
				<h3 className="text-xl font-semibold text-gray-800">{title}</h3>
				<h3 className="text-md font-medium text-gray-700">10:00 - 12:00</h3>
				<h3 className="text-sm text-gray-600">School Premises</h3>
			</div>
		</div>
	);
};

const KindergartenEventsGrid = ({ events }) => {
	return (
		<div className="p-12 mx-auto">
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{events.map((event, index) => (
					<EventCard key={index} date={event.eventdate} title={event.eventname} />
				))}
			</div>
		</div>
	);
};

export default KindergartenEventsGrid;

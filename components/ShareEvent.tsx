"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ShareEventProps {
	title: string;
	description: string;
	url: string;
	startDate: Date;
	country: string;
	venue: string;
	price: string;
	poster: string;
}

export default function ShareEvent({ title, description, url = "knsentertainment.eu", startDate, country, venue, price, poster }: ShareEventProps) {
	const shareData = {
		title,
		description,
		url,
		country,
		venue,
		price,
		poster,
	};

	const handleShare = async (platform: string, description: string) => {
		try {
			switch (platform) {
				case "native":
					if (navigator.share) {
						await navigator.share(shareData);
					} else {
						throw new Error("Native sharing not supported");
					}
					break;
				case "facebook":
					window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(poster)}&quote=${encodeURIComponent(description)}`, "_blank");
					break;
				case "instagram":
					const urll = encodeURIComponent(poster); // Link to the image or content
					const instagramUrl = `https://www.instagram.com/create/story/?media=${urll}`;
					window.open(instagramUrl, "_blank");
					break;

				case "email":
					window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${poster}`)}`;
					break;
				case "whatsapp":
					window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`, "_blank");
					break;
				default:
					throw new Error("Invalid sharing platform");
			}
		} catch (err) {
			console.error("Error sharing:", err);
		}
	};

	const generateCalendarLinks = () => {
		const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");

		const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${formatDate(startDate)}`;

		const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&startdt=${startDate.toISOString()}`;

		const ics = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${url}
DTSTART:${formatDate(startDate)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

		return { google, outlook, ics };
	};

	const calendarLinks = generateCalendarLinks();

	return (
		<Card className="w-full mx-auto">
			<CardHeader>
				<CardTitle className="text-md md:text-lg font-bold text-slate-800">Share This Event</CardTitle>
				<CardDescription>Share this event with your friends and colleagues</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex">
					<svg className="w-32 cursor-pointer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 96 96" aria-label="Share on Facebook" role="img" onClick={() => handleShare("facebook", description)}>
						<linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#2aa4f4"></stop>
							<stop offset="1" stopColor="#007ad9"></stop>
						</linearGradient>
						<path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path>
						<path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
					</svg>

					<svg className="w-32 cursor-pointer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 96 96" aria-label="Share on Instagram" role="img" onClick={() => handleShare("instagram", description)}>
						<radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#fd5"></stop>
							<stop offset=".328" stopColor="#ff543f"></stop>
							<stop offset=".348" stopColor="#fc5245"></stop>
							<stop offset=".504" stopColor="#e64771"></stop>
							<stop offset=".643" stopColor="#d53e91"></stop>
							<stop offset=".761" stopColor="#cc39a4"></stop>
							<stop offset=".841" stopColor="#c837ab"></stop>
						</radialGradient>
						<path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
						<radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse">
							<stop offset="0" stopColor="#4168c9"></stop>
							<stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop>
						</radialGradient>
						<path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
						<path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path>
						<circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
						<path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
					</svg>

					<svg className="w-32 cursor-pointer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 96 96" aria-label="Email this event" role="img" onClick={() => handleShare("email", description)}>
						<path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
						<path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
						<polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
						<path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path>
						<path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
					</svg>

					<svg className="w-32 cursor-pointer" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 96 96" aria-label="Share on WhatsApp" role="img" onClick={() => handleShare("whatsapp", description)}>
						<path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
						<path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
						<path
							fill="#cfd8dc"
							d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
						></path>
						<path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
						<path
							fill="#fff"
							fillRule="evenodd"
							d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
							clipRule="evenodd"
						></path>
					</svg>
				</div>

				<div className="">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="lg" className="bg-slate-700 hover:bg-black text-slate-200 font-bold gap-2">
								<Calendar className="w-5 h-5" />
								Add to Calendar
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="center">
							<DropdownMenuItem asChild>
								<a href={calendarLinks.google} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
									Google Calendar
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href={calendarLinks.outlook} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
									Outlook Calendar
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a href={calendarLinks.ics} download="event.ics" className="cursor-pointer">
									Download .ics
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	);
}

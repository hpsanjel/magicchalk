"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ContactForm from "./ContactForm";
import useFetchData from "@/hooks/useFetchData";

const ContactCard = () => {
	const [copiedField, setCopiedField] = React.useState(null);
	const { data: settings, error, loading } = useFetchData("/api/settings", "settings");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Loading failed{error}</p>;

	const handleCopy = (text, field) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	return (
		<section id="contact" className="py-16 bg-gray-100">
			<div className="container sm:mx-auto rounded-xl">
				<h2 className="text-3xl font-bold text-center mb-12">
					Let&apos;s Get <span className="text-red-500">Connected</span>
				</h2>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Main Contact Card */}
					<Card className="bg-white shadow-lg mx-4">
						<CardContent className="p-6">
							<div className="space-y-8">
								{/* Contact Person Section */}
								<div className="flex items-center space-x-4">
									<div className="h-16 w-16 rounded-full flex items-center justify-center">
										<Image src="/kiran.jpeg" alt="Kiran Gurung" width={100} height={100} className="w-full rounded-full" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-gray-800">{settings?.[0]?.name}</h2>
										<p className="text-gray-600">{settings?.[0]?.position}</p>
									</div>
								</div>

								{/* Contact Information */}
								<div className="space-y-4">
									{/* Email */}
									<div className="group relative flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
										<Mail className="h-5 w-5 text-blue-500 mr-3" />
										<div className="flex-grow">
											<p className="text-sm text-gray-500">Email</p>
											<p className="text-gray-800">{settings?.[0]?.email}</p>
										</div>
										<button onClick={() => handleCopy(contactInfo.email, "email")} className="p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white rounded-full" aria-label="Copy email">
											{copiedField === "email" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
										</button>
									</div>

									{/* Phone */}
									<div className="group relative flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
										<Phone className="h-5 w-5 text-green-500 mr-3" />
										<div className="flex-grow">
											<p className="text-sm text-gray-500">Phone</p>
											<p className="text-gray-800">{settings?.[0]?.phone}</p>
										</div>
										<button onClick={() => handleCopy(contactInfo.phone, "phone")} className="p-2 opacity-0 group-hover:opacity-100 transition-all duration-300  hover:bg-white rounded-full" aria-label="Copy phone">
											{copiedField === "phone" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
										</button>
									</div>

									{/* Address */}
									<div className="group relative flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
										<MapPin className="h-5 w-5 text-red-500 mr-3" />
										<div className="flex-grow">
											<p className="text-sm text-gray-500">Address</p>
											<p className="text-gray-800">{settings?.[0]?.address}</p>
										</div>
										<button onClick={() => handleCopy(contactInfo.address, "address")} className="p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white rounded-full" aria-label="Copy address">
											{copiedField === "address" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
										</button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Form Card */}
					<ContactForm />
					{/* Social Links Card */}
					<Card className="bg-white shadow-lg mx-4">
						<CardContent className="p-6">
							{/* Business Hours */}
							<div className="">
								<h3 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-center p-2 bg-gray-50 rounded">
										<span className="text-gray-600">Monday - Friday</span>
										<span className="text-gray-800 font-medium">{settings?.[0]?.businessHoursMF}</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-gray-50 rounded">
										<span className="text-gray-600">Saturday</span>
										<span className="text-gray-800 font-medium">{settings?.[0]?.businessHoursSat}</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-gray-50 rounded">
										<span className="text-gray-600">Sunday</span>
										<span className="text-gray-800 font-medium">{settings?.[0]?.businessHoursSun}</span>
									</div>
								</div>
							</div>
							<h3 className="text-lg font-semibold text-gray-800 my-6">Let&apos;s Be Social</h3>
							<div className="grid grid-cols-2 gap-4">
								{/* {socialLinks.map(
									(social) =>
										social.url && (
											<Button key={social.name} onClick={() => window.open(social.url, "_blank")} className={`w-full ${social.color} text-slate-200 flex items-center justify-center space-x-2 transition-transform hover:scale-105`}>
												<social.icon className="h-5 w-5" />
												<span>{social.name}</span>
												<ExternalLink className="h-4 w-4" />
											</Button>
										)
								)} */}

								<Button key={settings?.[0]?.facebook} onClick={() => window.open(`${settings?.[0]?.facebook}`, "_blank")} className={`w-full bg-blue-700 text-slate-200 flex items-center justify-center space-x-2 transition-transform hover:scale-105`}>
									<Facebook className="h-5 w-5" />

									<span>Facebook</span>
									<ExternalLink className="h-4 w-4" />
								</Button>

								<Button key={settings?.[0]?.Instagram} onClick={() => window.open(`${settings?.[0]?.facebook}`, "_blank")} className={`w-full bg-red-700 text-slate-200 flex items-center justify-center space-x-2 transition-transform hover:scale-105`}>
									<Instagram className="h-5 w-5" />

									<span>Instagram</span>
									<ExternalLink className="h-4 w-4" />
								</Button>
								<Button key={settings?.[0]?.Youtube} onClick={() => window.open(`${settings?.[0]?.facebook}`, "_blank")} className={`w-full bg-red-700 text-slate-200 flex items-center justify-center space-x-2 transition-transform hover:scale-105`}>
									<Youtube className="h-5 w-5" />

									<span>Youtube</span>
									<ExternalLink className="h-4 w-4" />
								</Button>
								<Button key={settings?.[0]?.Linkedin} onClick={() => window.open(`${settings?.[0]?.facebook}`, "_blank")} className={`w-full bg-blue-700 text-slate-200 flex items-center justify-center space-x-2 transition-transform hover:scale-105`}>
									<Linkedin className="h-5 w-5" />

									<span>LinkedIn</span>
									<ExternalLink className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ContactCard;

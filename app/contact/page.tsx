"use client";

import { useState } from "react";
import { useForm, SubmitHandler, ControllerRenderProps, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { submitMessage } from "../actions/submitMessage";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
	firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
	lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
	country: z.string().min(1, { message: "Please select a country." }),
	message: z.string().min(10, { message: "Message must be at least 10 characters." }),
	agreeToTerms: z.boolean().refine((value) => value === true, {
		message: "You must agree to the privacy policy.",
	}),
});

type FormSchemaType = z.infer<typeof formSchema>;

const countries = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"Andorra",
	"Angola",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bhutan",
	"Bolivia",
	"Bosnia and Herzegovina",
	"Botswana",
	"Brazil",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Côte d'Ivoire",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Central African Republic",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Comoros",
	"Congo",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Cyprus",
	"Czech Republic",
	"Democratic Republic of the Congo",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Fiji",
	"Finland",
	"France",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Greece",
	"Grenada",
	"Guatemala",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Holy See",
	"Honduras",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Kuwait",
	"Kyrgyzstan",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Mauritania",
	"Mauritius",
	"Mexico",
	"Micronesia",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"North Korea",
	"North Macedonia",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine State",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Qatar",
	"Romania",
	"Russia",
	"Rwanda",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Korea",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan",
	"Suriname",
	"Sweden",
	"Switzerland",
	"Syria",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela",
	"Vietnam",
	"Yemen",
	"Zambia",
	"Zimbabwe",
];

export default function ContactPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			country: "",
			message: "",
			agreeToTerms: false,
		},
	});

	const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (key !== "agreeToTerms") {
				formData.append(key, typeof value === "boolean" ? value.toString() : value);
			}
		});

		const result = await submitMessage(formData);

		if (result.success) {
			toast({
				title: "Success",
				description: result.message,
			});
			form.reset();
		} else {
			toast({
				title: "Error",
				description: result.message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="bg-red-50">
			<div className="container max-w-7xl mx-auto px-4 md:px-16 pt-36 pb-16">
				<div className="text-center mb-12">
					<h1 className="text-3xl text-center font-bold mb-6">
						Contact <span className="text-red-500">Us</span>
					</h1>
					<p className="text-muted-foreground  md:text-lg ">Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 col-span-2 md:space-y-10 border bg-white border-zinc-300 rounded-lg p-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
										<FormItem>
											<FormLabel className="md:text-lg md:font-semibold">First Name</FormLabel>
											<FormControl>
												<Input placeholder="Kamal" className="py-6 md:text-lg transition-all duration-200 focus:scale-[1.02]" {...field} value={typeof field.value === "boolean" ? field.value.toString() : field.value} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
										<FormItem>
											<FormLabel className="md:text-lg md:font-semibold">Last Name</FormLabel>
											<FormControl>
												<Input placeholder="Adhikari" className="py-6  md:text-lg transition-all duration-200 focus:scale-[1.02]" {...field} value={typeof field.value === "boolean" ? field.value.toString() : field.value} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
										<FormItem>
											<FormLabel className="md:text-lg md:font-semibold">Email</FormLabel>
											<FormControl>
												<Input placeholder="kamal_adh@gmail.com" className="py-6  md:text-lg transition-all duration-200 focus:scale-[1.02]" {...field} value={typeof field.value === "boolean" ? field.value.toString() : field.value} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
										<FormItem>
											<FormLabel className="md:text-lg md:font-semibold">Phone Number</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+47 46114530" className="py-6  md:text-lg transition-all duration-200 focus:scale-[1.02]" {...field} value={typeof field.value === "boolean" ? field.value.toString() : field.value} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="country"
								render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
									<FormItem>
										<FormLabel className="md:text-lg md:font-semibold">Country</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={typeof field.value === "boolean" ? field.value.toString() : field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a country" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{countries.map((country) => (
													<SelectItem key={country} value={country}>
														{country}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="message"
								render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
									<FormItem>
										<FormLabel className="md:text-lg md:font-semibold">Message</FormLabel>
										<FormControl>
											<Textarea rows={12} placeholder="Your message here." className="py-6  md:text-lg  transition-all duration-200 focus:scale-[1.02]" {...field} value={typeof field.value === "boolean" ? field.value.toString() : field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="agreeToTerms"
								render={({ field }: { field: ControllerRenderProps<FormSchemaType, FieldPath<FormSchemaType>> }) => (
									<FormItem className="flex flex-row items-center space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={typeof field.value === "boolean" ? field.value : undefined} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className=" md:text-lg ">
												I have read and understood all the{" "}
												<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
													<DialogTrigger asChild>
														<Button variant="link" className="p-0 h-auto  md:text-lg  underline">
															privacy policy
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Privacy Policy</DialogTitle>
															<DialogDescription>This is where you would put your privacy policy content. Make sure to include all necessary information about how you handle user data, cookies, third-party services, and user rights.</DialogDescription>
														</DialogHeader>
													</DialogContent>
												</Dialog>
												.
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={!form.getValues().agreeToTerms}>
								Submit
							</Button>
						</form>
					</Form>

					<div className="grid gap-6 grid-cols-1">
						<Card className="group hover:shadow-lg transition-all duration-300 flex items-center justify-center">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<MapPin className="w-6 h-6 text-rose-500" />
								</div>
								<div>
									<h3 className="font-semibold">Address</h3>
									<p className="text-md md:text-lg text-muted-foreground">Helgesens gate, 5563 Oslo</p>
								</div>
							</CardContent>
						</Card>

						<Card className="group hover:shadow-lg transition-all duration-300  flex items-center justify-center">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Phone className="w-6 h-6 text-rose-500" />
								</div>
								<div>
									<h3 className="font-semibold">Phone</h3>
									<p className="text-md md:text-lg text-muted-foreground">+47 45921405</p>
								</div>
							</CardContent>
						</Card>

						<Card className="group hover:shadow-lg transition-all duration-300  flex items-center justify-center">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Mail className="w-6 h-6 text-rose-500" />
								</div>
								<div>
									<h3 className="font-semibold">Email</h3>
									<p className="text-md md:text-lg text-muted-foreground">gurungkns19@gmail.com</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

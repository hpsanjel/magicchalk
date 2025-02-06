"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Smile } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
	const initialFormData = {
		eventType: "",
		companyName: "",
		address: "",
		contactName: "",
		email: "",
		phone: "",
		offeredPrice: "",
		additionalInfo: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");
	const [isChecked, setIsChecked] = useState(false);
	const recaptchaRef = useRef(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.eventType.trim()) {
			newErrors.eventType = "Event type is required";
		}
		if (!formData.companyName.trim()) {
			newErrors.companyName = "Company name is required";
		}
		if (!formData.address.trim()) {
			newErrors.address = "Address is required";
		}
		if (!formData.contactName.trim()) {
			newErrors.contactName = "Contact person name is required";
		}
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		}
		if (!formData.offeredPrice.trim()) {
			newErrors.offeredPrice = "Offered price is required";
		}

		return newErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateForm();

		if (Object.keys(newErrors).length === 0) {
			const recaptchaValue = recaptchaRef.current.getValue(); // Get reCAPTCHA response
			if (!recaptchaValue) {
				setErrors({ recaptcha: "Please complete the reCAPTCHA verification." });
				return;
			}

			setIsSubmitting(true);
			try {
				const response = await fetch("/api/submit-form", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ...formData, recaptchaToken: recaptchaValue }),
				});

				if (response.ok) {
					setMessage("Thanks for reaching out! We'll get back to you soon.");
					setFormData(initialFormData);
					recaptchaRef.current.reset(); // Reset reCAPTCHA
				} else {
					const errorData = await response.json();
					console.error("Error submitting form:", errorData);
					setMessage("There was an error submitting the form. Please try again.");
				}
			} catch (error) {
				console.error("Error submitting form:", error);
				setMessage("There was an error submitting the form. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		} else {
			setErrors(newErrors);
		}
	};

	const handleReset = () => {
		setFormData(initialFormData);
		setErrors({});
		recaptchaRef.current.reset(); // Reset reCAPTCHA
	};

	return (
		<div className="bg-red-50">
			<div className="container mx-2 sm:mx-auto pt-40 pb-20">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Request <span className="text-red-500">a quote </span>
				</h2>
				<Card className="mx-auto bg-white w-full md:w-1/2 rounded-none">
					<CardContent className="p-6">
						{message ? (
							<div className="flex flex-col items-center justify-center p-6 space-y-4 border border-green-700 bg-green-50">
								<Smile className="h-12 w-12 text-green-700" />
								<p className="text-green-700 text-center">{message}</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-8">
								<div>
									<h3 className="text-xl font-semibold text-gray-800">Have questions or want to collaborate?</h3>
									<p className="text-gray-600 mb-6">Reach out to us and let&apos;s craft extraordinary events together!</p>
								</div>
								{/* Company Movie or event Dropdown */}
								<div className="relative ">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Please select the type of program first <span className="text-red-500">*</span>
									</label>
									<Select value={formData.eventType} onValueChange={(value) => handleChange({ target: { name: "eventType", value } })}>
										<SelectTrigger className="w-full bg-gray-50">
											<SelectValue placeholder="Select Program Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="movie">Movie</SelectItem>
											<SelectItem value="event">Event</SelectItem>
										</SelectContent>
									</Select>

									{errors.eventType && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.eventType}</p>}
								</div>
								{/* Company Name Input */}

								<div className="relative">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name of Company or Organization <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										name="companyName"
										placeholder="Enter company or organization name"
										value={formData.companyName}
										onChange={handleChange}
										className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.companyName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
									/>
									{errors.companyName && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.companyName}</p>}
								</div>

								{/* Contact Person Name Input */}
								<div className="relative">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Contact Person Name <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										name="contactName"
										placeholder="Enter contact person name"
										value={formData.contactName}
										onChange={handleChange}
										className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.contactName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
									/>
									{errors.contactName && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.contactName}</p>}
								</div>

								<div className="flex flex-col sm:flex-row justify-between gap-2 space-y-4 sm:space-y-0">
									{/* Address Input */}
									<div className="relative w-full sm:w-1/2">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Address <span className="text-red-500">*</span>
										</label>
										<Input
											type="text"
											name="address"
											placeholder="Enter country and city"
											value={formData.address}
											onChange={handleChange}
											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
										/>
										{errors.address && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.address}</p>}
									</div>
									{/* Phone Input */}
									<div className="relative w-full sm:w-1/3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											WhatsApp Number <span className="text-red-500">*</span>
										</label>
										<Input
											type="tel"
											name="phone"
											placeholder="Enter phone number"
											value={formData.phone}
											onChange={handleChange}
											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
										/>
										{/* <p className="text-xs text-gray-500 mt-1">We will try to reach via Whatsapp. Please make sure the number is correct.</p> */}
										{errors.phone && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.phone}</p>}
									</div>
								</div>

								<div className="flex flex-col sm:flex-row justify-between gap-2 space-y-4 sm:space-y-0">
									{/* Email Input */}
									<div className="relative w-full sm:w-1/2">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Contact Email <span className="text-red-500">*</span>
										</label>
										<Input
											type="email"
											name="email"
											placeholder="Enter contact email"
											value={formData.email}
											onChange={handleChange}
											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
										/>
										{errors.email && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.email}</p>}
									</div>
									{/* Offered Price Input */}
									<div className="relative w-full sm:w-1/3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Your Offered Price <span className="text-red-500">*</span>
										</label>
										<Input
											type="text"
											name="offeredPrice"
											placeholder="Enter your offered price"
											value={formData.offeredPrice}
											onChange={handleChange}
											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
							  ${errors.offeredPrice ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
										/>
										{errors.offeredPrice && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.offeredPrice}</p>}
									</div>
								</div>

								{/* Additional Information Textarea */}
								<div className="relative">
									<label className="block text-sm font-medium text-gray-700 mb-1">Any Additional Information</label>
									<Textarea name="additionalInfo" placeholder="Enter any additional information" value={formData.additionalInfo} onChange={handleChange} className="w-full p-3 h-36 rounded-lg bg-gray-50 border transition-colors focus:bg-white resize-none border-gray-200 focus:border-blue-500" />
								</div>

								<div className="space-y-1 leading-none">
									<div className="flex items-center space-x-2 ">
										<Checkbox id="privacyPolicyCheckbox" checked={isChecked} onCheckedChange={(value) => setIsChecked(value)} />{" "}
										<p>
											I have read and understood all the{" "}
											<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
												<DialogTrigger asChild>
													<Button variant="link" className="p-0 h-auto text-lg underline">
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
										</p>
									</div>
								</div>

								<div>
									<ReCAPTCHA ref={recaptchaRef} sitekey="6Lc637QqAAAAAJdDci1aCFZigJZ3y7LhoKH14sOD" onErrored={() => setErrors({ recaptcha: "Failed to load reCAPTCHA. Please try again." })} />
									{errors.recaptcha && <p className="text-xs text-red-500 mt-2">{errors.recaptcha}</p>}
								</div>

								{/* Submit Button */}
								<div className="flex gap-4">
									<Button type="submit" disabled={!isChecked || isSubmitting} className="w-max bg-slate-700 hover:bg-black text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
										{isSubmitting ? (
											<>
												<Loader2 className="h-5 w-5 animate-spin" />
												<span>Submitting...</span>
											</>
										) : (
											<>
												<Send className="h-5 w-5" />
												<span>Submit</span>
											</>
										)}
									</Button>
									<Button variant="secondary" type="button" onClick={handleReset} className="hover:bg-slate-200">
										Reset
									</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ContactForm;

// "use client";

// import React from "react";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Loader2, Smile } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";

// const ContactForm = () => {
// 	const initialFormData = {
// 		eventType: "",
// 		companyName: "",
// 		address: "",
// 		contactName: "",
// 		email: "",
// 		phone: "",
// 		offeredPrice: "",
// 		additionalInfo: "",
// 	};

// const [formData, setFormData] = useState(initialFormData);
// const [isSubmitting, setIsSubmitting] = useState(false);
// const [errors, setErrors] = useState({});
// const [message, setMessage] = useState("");
// const [isDialogOpen, setIsDialogOpen] = useState(false);
// const [isChecked, setIsChecked] = useState(false);

// 	const validateForm = () => {
// 		const newErrors = {};
// 		if (!formData.eventType.trim()) {
// 			newErrors.companyName = "Event type is required";
// 		}
// 		if (!formData.companyName.trim()) {
// 			newErrors.companyName = "Company name is required";
// 		}
// 		if (!formData.address.trim()) {
// 			newErrors.address = "Address are required";
// 		}
// 		if (!formData.contactName.trim()) {
// 			newErrors.contactName = "Contact person name is required";
// 		}
// 		if (!formData.email.trim()) {
// 			newErrors.email = "Email is required";
// 		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// 			newErrors.email = "Please enter a valid email";
// 		}
// 		if (!formData.phone.trim()) {
// 			newErrors.phone = "Phone number is required";
// 		}
// 		if (!formData.offeredPrice.trim()) {
// 			newErrors.offeredPrice = "Offered price is required";
// 		}

// 		return newErrors;
// 	};

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({
// 			...prev,
// 			[name]: value,
// 		}));
// 		// Clear error when user starts typing
// 		if (errors[name]) {
// 			setErrors((prev) => ({
// 				...prev,
// 				[name]: "",
// 			}));
// 		}
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		const newErrors = validateForm();

// 		if (Object.keys(newErrors).length === 0) {
// 			setIsSubmitting(true);
// 			try {
// 				const response = await fetch("/api/submit-form", {
// 					method: "POST",
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 					body: JSON.stringify(formData),
// 				});

// 				if (response.ok) {
// 					setMessage("Thanks for reaching out! We'll get back to you soon.");
// 					setFormData(initialFormData);
// 				} else {
// 					const errorData = await response.json();
// 					console.error("Error submitting form:", errorData);
// 					setMessage("There was an error submitting the form. Please try again.");
// 				}
// 			} catch (error) {
// 				console.error("Error submitting form:", error);
// 				setMessage("There was an error submitting the form. Please try again.");
// 			} finally {
// 				setIsSubmitting(false);
// 			}
// 		} else {
// 			setErrors(newErrors);
// 		}
// 	};

// 	const handleReset = () => {
// 		setFormData(initialFormData);
// 		setErrors({});
// 	};

// 	return (
// 		<div className="bg-red-50">
// 			<div className="container mx-2 sm:mx-auto pt-40 pb-20">
// 				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
// 					Request <span className="text-red-500">a quote </span>
// 				</h2>
// 				<Card className="mx-auto bg-white w-full md:w-1/2 rounded-none">
// 					<CardContent className="p-6">
// 						{message ? (
// 							<div className="flex flex-col items-center justify-center p-6 space-y-4 border border-green-700 bg-green-50">
// 								<Smile className="h-12 w-12 text-green-700" />
// 								<p className="text-green-700 text-center">{message}</p>
// 								{/* <Button onClick={() => setMessage("")}>Send another message</Button> */}
// 							</div>
// 						) : (
// 							<form onSubmit={handleSubmit} className="space-y-8">
// 								<div>
// 									<h3 className="text-xl font-semibold text-gray-800">Have questions or want to collaborate?</h3>
// 									<p className="text-gray-600 mb-6">Reach out to us and let&apos;s craft extraordinary events together!</p>
// 								</div>
// 								{/* Company Movie or event Dropdown */}
// 								<div className="relative ">
// 									<label className="block text-sm font-medium text-gray-700 mb-1">
// 										Please select the type of program first <span className="text-red-500">*</span>
// 									</label>
// 									<Select value={formData.eventType} onValueChange={(value) => handleChange({ target: { name: "eventType", value } })}>
// 										<SelectTrigger className="w-full bg-gray-50">
// 											<SelectValue placeholder="Select Program Type" />
// 										</SelectTrigger>
// 										<SelectContent>
// 											<SelectItem value="movie">Movie</SelectItem>
// 											<SelectItem value="event">Event</SelectItem>
// 										</SelectContent>
// 									</Select>

// 									{errors.eventType && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.eventType}</p>}
// 								</div>
// 								{/* Company Name Input */}

// 								<div className="relative">
// 									<label className="block text-sm font-medium text-gray-700 mb-1">
// 										Name of Company or Organization <span className="text-red-500">*</span>
// 									</label>
// 									<Input
// 										type="text"
// 										name="companyName"
// 										placeholder="Enter company or organization name"
// 										value={formData.companyName}
// 										onChange={handleChange}
// 										className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.companyName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 									/>
// 									{errors.companyName && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.companyName}</p>}
// 								</div>

// 								{/* Contact Person Name Input */}
// 								<div className="relative">
// 									<label className="block text-sm font-medium text-gray-700 mb-1">
// 										Contact Person Name <span className="text-red-500">*</span>
// 									</label>
// 									<Input
// 										type="text"
// 										name="contactName"
// 										placeholder="Enter contact person name"
// 										value={formData.contactName}
// 										onChange={handleChange}
// 										className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.contactName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 									/>
// 									{errors.contactName && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.contactName}</p>}
// 								</div>

// 								<div className="flex flex-col sm:flex-row justify-between gap-2 space-y-4 sm:space-y-0">
// 									{/* Address Input */}
// 									<div className="relative w-full sm:w-1/2">
// 										<label className="block text-sm font-medium text-gray-700 mb-1">
// 											Address <span className="text-red-500">*</span>
// 										</label>
// 										<Input
// 											type="text"
// 											name="address"
// 											placeholder="Enter country and city"
// 											value={formData.address}
// 											onChange={handleChange}
// 											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 										/>
// 										{errors.address && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.address}</p>}
// 									</div>
// 									{/* Phone Input */}
// 									<div className="relative w-full sm:w-1/3">
// 										<label className="block text-sm font-medium text-gray-700 mb-1">
// 											WhatsApp Number <span className="text-red-500">*</span>
// 										</label>
// 										<Input
// 											type="tel"
// 											name="phone"
// 											placeholder="Enter phone number"
// 											value={formData.phone}
// 											onChange={handleChange}
// 											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 										/>
// 										{/* <p className="text-xs text-gray-500 mt-1">We will try to reach via Whatsapp. Please make sure the number is correct.</p> */}
// 										{errors.phone && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.phone}</p>}
// 									</div>
// 								</div>

// 								<div className="flex flex-col sm:flex-row justify-between gap-2 space-y-4 sm:space-y-0">
// 									{/* Email Input */}
// 									<div className="relative w-full sm:w-1/2">
// 										<label className="block text-sm font-medium text-gray-700 mb-1">
// 											Contact Email <span className="text-red-500">*</span>
// 										</label>
// 										<Input
// 											type="email"
// 											name="email"
// 											placeholder="Enter contact email"
// 											value={formData.email}
// 											onChange={handleChange}
// 											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 										/>
// 										{errors.email && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.email}</p>}
// 									</div>
// 									{/* Offered Price Input */}
// 									<div className="relative w-full sm:w-1/3">
// 										<label className="block text-sm font-medium text-gray-700 mb-1">
// 											Your Offered Price <span className="text-red-500">*</span>
// 										</label>
// 										<Input
// 											type="text"
// 											name="offeredPrice"
// 											placeholder="Enter your offered price"
// 											value={formData.offeredPrice}
// 											onChange={handleChange}
// 											className={`w-full p-3 rounded-lg bg-gray-50 border transition-colors focus:bg-white
// 							  ${errors.offeredPrice ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
// 										/>
// 										{errors.offeredPrice && <p className="absolute -bottom-4 left-0 text-xs text-red-500">{errors.offeredPrice}</p>}
// 									</div>
// 								</div>

// 								{/* Additional Information Textarea */}
// 								<div className="relative">
// 									<label className="block text-sm font-medium text-gray-700 mb-1">Any Additional Information</label>
// 									<Textarea name="additionalInfo" placeholder="Enter any additional information" value={formData.additionalInfo} onChange={handleChange} className="w-full p-3 h-36 rounded-lg bg-gray-50 border transition-colors focus:bg-white resize-none border-gray-200 focus:border-blue-500" />
// 								</div>

// 								<div className="space-y-1 leading-none">
// 									<div className="flex items-center space-x-2 ">
// 										<Checkbox id="privacyPolicyCheckbox" checked={isChecked} onCheckedChange={(value) => setIsChecked(value)} />{" "}
// 										<p>
// 											I have read and understood all the{" "}
// 											<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// 												<DialogTrigger asChild>
// 													<Button variant="link" className="p-0 h-auto text-lg underline">
// 														privacy policy
// 													</Button>
// 												</DialogTrigger>
// 												<DialogContent>
// 													<DialogHeader>
// 														<DialogTitle>Privacy Policy</DialogTitle>
// 														<DialogDescription>This is where you would put your privacy policy content. Make sure to include all necessary information about how you handle user data, cookies, third-party services, and user rights.</DialogDescription>
// 													</DialogHeader>
// 												</DialogContent>
// 											</Dialog>
// 											.
// 										</p>
// 									</div>
// 								</div>

// 								{/* Submit Button */}
// 								<div className="flex gap-4">
// 									<Button type="submit" disabled={!isChecked} className="w-max bg-slate-700 hover:bg-black text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
// 										{isSubmitting ? (
// 											<>
// 												<Loader2 className="h-5 w-5 animate-spin" />
// 												<span>Submitting...</span>
// 											</>
// 										) : (
// 											<>
// 												<Send className="h-5 w-5" />
// 												<span>Submit</span>
// 											</>
// 										)}
// 									</Button>
// 									<Button variant="secondary" type="button" onClick={handleReset} className="hover:bg-slate-200">
// 										Reset
// 									</Button>{" "}
// 								</div>
// 							</form>
// 						)}
// 					</CardContent>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// };

// export default ContactForm;

"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadPhoto } from "@/utils/photoUploadService";
import Image from "next/image";

export default function AdmissionForm() {
	const [photoPreview, setPhotoPreview] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState(null);
	const [formSuccess, setFormSuccess] = useState(null);
	const fileInputRef = useRef(null);
	const formRef = useRef(null);
	const videoRef = useRef(null);
	const [showCamera, setShowCamera] = useState(false);
	const streamRef = useRef(null);
	const [cameraError, setCameraError] = useState(null);

	// Clean up camera stream when component unmounts
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	// Add effect to handle video when showCamera changes
	useEffect(() => {
		if (showCamera && videoRef.current && streamRef.current) {
			videoRef.current.srcObject = streamRef.current;
			videoRef.current.onloadedmetadata = () => {
				videoRef.current.play().catch((err) => {
					console.error("Error playing video:", err);
					setCameraError("Failed to start video preview");
				});
			};
		}
	}, [showCamera]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPhotoPreview(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current.click();
	};

	const handleCameraClick = async () => {
		try {
			setCameraError(null);

			// Close any existing stream
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			console.log("Attempting to access camera...");

			// Open camera with explicit constraints
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
				audio: false,
			});

			console.log("Camera access granted:", stream);
			streamRef.current = stream;

			// Set showCamera first, then handle video in the useEffect
			setShowCamera(true);
		} catch (err) {
			console.error("Error accessing camera:", err);
			setCameraError(`Could not access the camera: ${err.message}`);
			alert("Could not access the camera. Please ensure camera permissions are granted or use the Upload option instead.");
		}
	};

	const capturePhoto = () => {
		if (!videoRef.current || !streamRef.current) {
			console.error("Video or stream not available");
			setCameraError("Video stream not available for capture");
			return;
		}

		try {
			console.log("Attempting to capture photo...");

			// Create a canvas element
			const canvas = document.createElement("canvas");
			const video = videoRef.current;

			// Ensure video dimensions are available
			if (!video.videoWidth) {
				console.error("Video dimensions not available");
				setCameraError("Video not ready for capture");
				return;
			}

			// Set canvas dimensions to match video
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

			// Draw the current video frame onto the canvas
			const ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Convert to data URL
			const dataUrl = canvas.toDataURL("image/jpeg");
			console.log("Photo captured successfully");

			// Update state
			setPhotoPreview(dataUrl);

			// Close camera stream
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			setShowCamera(false);
		} catch (err) {
			console.error("Error capturing photo:", err);
			setCameraError(`Failed to capture photo: ${err.message}`);
		}
	};

	const closeCamera = () => {
		// Close camera stream
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}

		setShowCamera(false);
		setCameraError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError(null);
		setFormSuccess(null);
		setIsSubmitting(true);

		try {
			// Check if photo is uploaded
			if (!photoPreview) {
				setFormError("Please upload or take a photo of your child.");
				setIsSubmitting(false);
				return;
			}

			// Get form data
			const formData = new FormData(formRef.current);
			const formEntries = Object.fromEntries(formData.entries());

			// Upload the photo and get the URL
			const photoUrl = await uploadPhoto(photoPreview);

			// Prepare the data for submission
			const submissionData = {
				// Child Information
				childName: formEntries["child-name"],
				dob: formEntries["dob"],
				gender: formEntries["gender"],
				photoUrl: photoUrl,

				// Parent/Guardian Information
				parentName: formEntries["parent-name"],
				relationship: formEntries["relationship"],
				email: formEntries["email"],
				phone: formEntries["phone"],
				address: formEntries["address"],

				// Additional Information
				allergies: formEntries["allergies"] || "",
				emergencyContact: formEntries["emergency-contact"],
				comments: formEntries["comments"] || "",
			};

			// Submit the data to the API
			const response = await fetch("/api/admission-form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submissionData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Error submitting application");
			}

			// Handle successful submission
			setFormSuccess("Thank you! Your application has been submitted successfully.");
			console.log("Form submitted successfully:", result);

			// Reset the form after submission
			formRef.current.reset();
			setPhotoPreview(null);

			// Scroll to top to show success message
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			console.error("Error submitting form:", error);
			setFormError(error.message || "Failed to submit application. Please try again.");
			// Scroll to top to show error message
			window.scrollTo({ top: 0, behavior: "smooth" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="pt-32">
			<Head>
				<title>Kindergarten Admission Application</title>
				<meta name="description" content="Apply for kindergarten admission" />
			</Head>

			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-3xl font-bold text-center text-green-600 mb-8">Kindergarten Admission Application</h1>
					<div className="w-24 h-1 bg-green-500 mx-auto mb-6 md:mb-12 rounded-full"></div>

					{formSuccess && <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">{formSuccess}</div>}

					{formError && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{formError}</div>}

					<form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
						{/* Child Information Section */}
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Child Information</h2>

							<div className="space-y-4">
								<div>
									<label htmlFor="child-name" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Child&apos;s Full Name
									</label>
									<Input type="text" id="child-name" name="child-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<label htmlFor="dob" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Date of Birth
									</label>
									<Input type="date" id="dob" name="dob" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<span className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">Gender</span>
									<div className="mt-2 flex space-x-6">
										<div className="flex items-center">
											<Input id="gender-male" name="gender" type="radio" value="male" required className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
											<label htmlFor="gender-male" className="ml-2 block text-sm text-gray-700">
												Male
											</label>
										</div>
										<div className="flex items-center">
											<Input id="gender-female" name="gender" type="radio" value="female" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
											<label htmlFor="gender-female" className="ml-2 block text-sm text-gray-700">
												Female
											</label>
										</div>
										<div className="flex items-center">
											<Input id="gender-other" name="gender" type="radio" value="other" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
											<label htmlFor="gender-other" className="ml-2 block text-sm text-gray-700">
												Other
											</label>
										</div>
									</div>
								</div>

								{/* Photo Upload Section */}
								<div className="mt-6">
									<label className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">Child&apos;s Photo</label>
									<div className="mt-2 flex flex-col items-center">
										{showCamera ? (
											<div className="camera-container w-full max-w-md">
												<div className="relative">
													{cameraError && <div className="text-red-600 mb-2 p-2 bg-red-100 rounded">{cameraError}</div>}
													<video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-md border-2 border-green-400"></video>
													<div className="mt-2 flex justify-center space-x-4">
														<button type="button" onClick={capturePhoto} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
															Take Photo
														</button>
														<button type="button" onClick={closeCamera} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
															Cancel
														</button>
													</div>
												</div>
											</div>
										) : (
											<>
												<div className="h-48 w-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">{photoPreview ? <Image src={photoPreview} alt="Preview" className="h-full w-full object-cover" width={500} height={500} /> : <span className="text-gray-500 text-sm">No photo selected</span>}</div>

												<div className="mt-4 flex space-x-3">
													<button type="button" onClick={handleUploadClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
														Upload Photo
													</button>
													<button type="button" onClick={handleCameraClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
														Take Picture
													</button>
												</div>
											</>
										)}

										<Input type="file" id="photo-upload" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
									</div>
								</div>
							</div>
						</div>

						{/* Parent/Guardian Information */}
						{/* (Same content as your original form) */}
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Parent/Guardian Information</h2>

							<div className="space-y-4">
								<div>
									<label htmlFor="parent-name" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Parent/Guardian Full Name
									</label>
									<Input type="text" id="parent-name" name="parent-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<label htmlFor="relationship" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Relationship to Child
									</label>
									<select id="relationship" name="relationship" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
										<option value="">-- Select Relationship --</option>
										<option value="mother">Mother</option>
										<option value="father">Father</option>
										<option value="grandparent">Grandparent</option>
										<option value="legal-guardian">Legal Guardian</option>
										<option value="other">Other</option>
									</select>
								</div>

								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Email Address
									</label>
									<Input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<label htmlFor="phone" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Phone Number
									</label>
									<Input type="tel" id="phone" name="phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<label htmlFor="address" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Home Address
									</label>
									<Textarea id="address" name="address" rows="3" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
								</div>
							</div>
						</div>

						{/* Additional Information */}
						{/* (Same content as your original form) */}
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>

							<div className="space-y-4">
								<div>
									<label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
										Does your child have any allergies or medical conditions?
									</label>
									<Textarea id="allergies" name="allergies" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
								</div>

								<div>
									<label htmlFor="emergency-contact" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
										Emergency Contact Name & Phone
									</label>
									<Input type="text" id="emergency-contact" name="emergency-contact" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
								</div>

								<div>
									<label htmlFor="comments" className="block text-sm font-medium text-gray-700">
										Additional Comments or Questions
									</label>
									<Textarea id="comments" name="comments" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
								</div>
							</div>
						</div>

						<div className="flex">
							<button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed">
								{isSubmitting ? "Submitting..." : "Submit Application"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

// "use client";
// import { useState, useRef, useEffect } from "react";
// import Head from "next/head";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// export default function AdmissionForm() {
// 	const [photoPreview, setPhotoPreview] = useState(null);
// 	const fileInputRef = useRef(null);
// 	const formRef = useRef(null);
// 	const videoRef = useRef(null);
// 	const [showCamera, setShowCamera] = useState(false);
// 	const streamRef = useRef(null);
// 	const [cameraError, setCameraError] = useState(null);

// 	// Clean up camera stream when component unmounts
// 	useEffect(() => {
// 		return () => {
// 			if (streamRef.current) {
// 				streamRef.current.getTracks().forEach((track) => track.stop());
// 			}
// 		};
// 	}, []);

// 	// Add effect to handle video when showCamera changes
// 	useEffect(() => {
// 		if (showCamera && videoRef.current && streamRef.current) {
// 			videoRef.current.srcObject = streamRef.current;
// 			videoRef.current.onloadedmetadata = () => {
// 				videoRef.current.play().catch((err) => {
// 					console.error("Error playing video:", err);
// 					setCameraError("Failed to start video preview");
// 				});
// 			};
// 		}
// 	}, [showCamera]);

// 	const handleFileChange = (e) => {
// 		const file = e.target.files[0];
// 		if (file) {
// 			const reader = new FileReader();
// 			reader.onload = (e) => {
// 				setPhotoPreview(e.target.result);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	};

// 	const handleUploadClick = () => {
// 		fileInputRef.current.click();
// 	};

// 	const handleCameraClick = async () => {
// 		try {
// 			setCameraError(null);

// 			// Close any existing stream
// 			if (streamRef.current) {
// 				streamRef.current.getTracks().forEach((track) => track.stop());
// 				streamRef.current = null;
// 			}

// 			console.log("Attempting to access camera...");

// 			// Open camera with explicit constraints
// 			const stream = await navigator.mediaDevices.getUserMedia({
// 				video: {
// 					facingMode: "user",
// 					width: { ideal: 1280 },
// 					height: { ideal: 720 },
// 				},
// 				audio: false,
// 			});

// 			console.log("Camera access granted:", stream);
// 			streamRef.current = stream;

// 			// Set showCamera first, then handle video in the useEffect
// 			setShowCamera(true);
// 		} catch (err) {
// 			console.error("Error accessing camera:", err);
// 			setCameraError(`Could not access the camera: ${err.message}`);
// 			alert("Could not access the camera. Please ensure camera permissions are granted or use the Upload option instead.");
// 		}
// 	};

// 	const capturePhoto = () => {
// 		if (!videoRef.current || !streamRef.current) {
// 			console.error("Video or stream not available");
// 			setCameraError("Video stream not available for capture");
// 			return;
// 		}

// 		try {
// 			console.log("Attempting to capture photo...");

// 			// Create a canvas element
// 			const canvas = document.createElement("canvas");
// 			const video = videoRef.current;

// 			// Ensure video dimensions are available
// 			if (!video.videoWidth) {
// 				console.error("Video dimensions not available");
// 				setCameraError("Video not ready for capture");
// 				return;
// 			}

// 			// Set canvas dimensions to match video
// 			canvas.width = video.videoWidth;
// 			canvas.height = video.videoHeight;

// 			console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

// 			// Draw the current video frame onto the canvas
// 			const ctx = canvas.getContext("2d");
// 			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// 			// Convert to data URL
// 			const dataUrl = canvas.toDataURL("image/jpeg");
// 			console.log("Photo captured successfully");

// 			// Update state
// 			setPhotoPreview(dataUrl);

// 			// Close camera stream
// 			if (streamRef.current) {
// 				streamRef.current.getTracks().forEach((track) => track.stop());
// 				streamRef.current = null;
// 			}

// 			setShowCamera(false);
// 		} catch (err) {
// 			console.error("Error capturing photo:", err);
// 			setCameraError(`Failed to capture photo: ${err.message}`);
// 		}
// 	};

// 	const closeCamera = () => {
// 		// Close camera stream
// 		if (streamRef.current) {
// 			streamRef.current.getTracks().forEach((track) => track.stop());
// 			streamRef.current = null;
// 		}

// 		setShowCamera(false);
// 		setCameraError(null);
// 	};

// 	const handleSubmit = (e) => {
// 		e.preventDefault();

// 		// Check if photo is uploaded
// 		if (!photoPreview) {
// 			alert("Please upload or take a photo of your child.");
// 			return;
// 		}

// 		// In a real application, you would submit the form data to your API here
// 		alert("Thank you! Your application has been submitted successfully.");
// 		console.log("Form submitted with data:", new FormData(formRef.current));

// 		// Optionally reset the form after submission
// 		// formRef.current.reset();
// 		// setPhotoPreview(null);
// 	};

// 	return (
// 		<div className="pt-32">
// 			<Head>
// 				<title>Kindergarten Admission Application</title>
// 				<meta name="description" content="Apply for kindergarten admission" />
// 			</Head>

// 			<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
// 				<div className="max-w-3xl mx-auto">
// 					<h1 className="text-3xl font-bold text-center text-green-600 mb-8">Kindergarten Admission Application</h1>

// 					<form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
// 						{/* Child Information Section */}
// 						<div className="bg-white shadow rounded-lg p-6">
// 							<h2 className="text-xl font-semibold text-gray-800 mb-4">Child Information</h2>

// 							<div className="space-y-4">
// 								<div>
// 									<label htmlFor="child-name" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Child's Full Name
// 									</label>
// 									<Input type="text" id="child-name" name="child-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<label htmlFor="dob" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Date of Birth
// 									</label>
// 									<Input type="date" id="dob" name="dob" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<span className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">Gender</span>
// 									<div className="mt-2 flex space-x-6">
// 										<div className="flex items-center">
// 											<Input id="gender-male" name="gender" type="radio" value="male" required className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
// 											<label htmlFor="gender-male" className="ml-2 block text-sm text-gray-700">
// 												Male
// 											</label>
// 										</div>
// 										<div className="flex items-center">
// 											<Input id="gender-female" name="gender" type="radio" value="female" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
// 											<label htmlFor="gender-female" className="ml-2 block text-sm text-gray-700">
// 												Female
// 											</label>
// 										</div>
// 										<div className="flex items-center">
// 											<Input id="gender-other" name="gender" type="radio" value="other" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
// 											<label htmlFor="gender-other" className="ml-2 block text-sm text-gray-700">
// 												Other
// 											</label>
// 										</div>
// 									</div>
// 								</div>

// 								{/* Photo Upload Section */}
// 								<div className="mt-6">
// 									<label className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">Child's Photo</label>
// 									<div className="mt-2 flex flex-col items-center">
// 										{showCamera ? (
// 											<div className="camera-container w-full max-w-md">
// 												<div className="relative">
// 													{cameraError && <div className="text-red-600 mb-2 p-2 bg-red-100 rounded">{cameraError}</div>}
// 													<video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-md border-2 border-green-400"></video>
// 													<div className="mt-2 flex justify-center space-x-4">
// 														<button type="button" onClick={capturePhoto} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
// 															Take Photo
// 														</button>
// 														<button type="button" onClick={closeCamera} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
// 															Cancel
// 														</button>
// 													</div>
// 												</div>
// 											</div>
// 										) : (
// 											<>
// 												<div className="h-48 w-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">{photoPreview ? <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" /> : <span className="text-gray-500 text-sm">No photo selected</span>}</div>

// 												<div className="mt-4 flex space-x-3">
// 													<button type="button" onClick={handleUploadClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
// 														Upload Photo
// 													</button>
// 													<button type="button" onClick={handleCameraClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
// 														Take Picture
// 													</button>
// 												</div>
// 											</>
// 										)}

// 										<Input type="file" id="photo-upload" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
// 										<Input type="hidden" id="photo-data" name="photo-data" value={photoPreview || ""} />
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Rest of the form remains unchanged */}
// 						{/* Parent/Guardian Information */}
// 						<div className="bg-white shadow rounded-lg p-6">
// 							<h2 className="text-xl font-semibold text-gray-800 mb-4">Parent/Guardian Information</h2>

// 							<div className="space-y-4">
// 								<div>
// 									<label htmlFor="parent-name" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Parent/Guardian Full Name
// 									</label>
// 									<Input type="text" id="parent-name" name="parent-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<label htmlFor="relationship" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Relationship to Child
// 									</label>
// 									<select id="relationship" name="relationship" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
// 										<option value="">-- Select Relationship --</option>
// 										<option value="mother">Mother</option>
// 										<option value="father">Father</option>
// 										<option value="grandparent">Grandparent</option>
// 										<option value="legal-guardian">Legal Guardian</option>
// 										<option value="other">Other</option>
// 									</select>
// 								</div>

// 								<div>
// 									<label htmlFor="email" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Email Address
// 									</label>
// 									<Input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<label htmlFor="phone" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Phone Number
// 									</label>
// 									<Input type="tel" id="phone" name="phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<label htmlFor="address" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Home Address
// 									</label>
// 									<Textarea id="address" name="address" rows="3" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Additional Information */}
// 						<div className="bg-white shadow rounded-lg p-6">
// 							<h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>

// 							<div className="space-y-4">
// 								<div>
// 									<label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
// 										Does your child have any allergies or medical conditions?
// 									</label>
// 									<Textarea id="allergies" name="allergies" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
// 								</div>

// 								<div>
// 									<label htmlFor="emergency-contact" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-0.5">
// 										Emergency Contact Name & Phone
// 									</label>
// 									<Input type="text" id="emergency-contact" name="emergency-contact" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
// 								</div>

// 								<div>
// 									<label htmlFor="comments" className="block text-sm font-medium text-gray-700">
// 										Additional Comments or Questions
// 									</label>
// 									<Textarea id="comments" name="comments" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></Textarea>
// 								</div>
// 							</div>
// 						</div>

// 						<div className="flex">
// 							<button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
// 								Submit Application
// 							</button>
// 						</div>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

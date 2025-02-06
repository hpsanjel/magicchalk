"use client";

import React, { useState, useCallback, memo } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs"; // Import Tabs components
import { useRouter } from "next/navigation";
import Image from "next/image";

const InputField = memo(({ id, icon: Icon, name, value, onChange, ...props }) => (
	<div className="relative">
		<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
		<Input id={id} name={name} value={value} onChange={onChange} {...props} className="pl-10" />
	</div>
));

InputField.displayName = "Input_Fields_User_Auth_Form";

export default function AuthForm() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		userName: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	// Optimized input change handler
	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			if (prev[name] === value) return prev; // Avoid unnecessary state updates
			return { ...prev, [name]: value };
		});
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
				}),
			});

			const result = await response.json();
			console.log(result);
			if (result.success) {
				alert("Login successful!");
				router.push("/gurungknsadmin1234");
			} else {
				setError(result.message || "Please use correct user credentials");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError(error.message || "An unexpected error occurred. Please try again.");
		}
	};

	const handleCancel = useCallback(() => {
		setFormData({
			fullName: "",
			email: "",
			userName: "",
			password: "",
		});
		setError("");
		router.push("/");
	}, [router]);

	// Password visibility toggle
	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader className="bg-red-700 text-slate-200 rounded-t-lg">
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
				</CardHeader>
				<CardContent className="mt-6">
					<div className="mb-6 flex justify-center">
						<Image src="/kns_logo_rect.png" alt="Auth" className="w-32 h-auto border boder-gray-300" width={100} height={100} />
					</div>
					{error && <p className="text-red-500 mb-4">{error}</p>}
					<Tabs defaultValue="login" className="w-full">
						<TabsContent value="login">
							<form onSubmit={handleLogin}>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="login-email">Email</Label>
										<InputField id="login-email" icon={Mail} name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="login-password">Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
											<Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10" />
											<button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
												{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
											</button>
										</div>
									</div>
								</div>
								<div className="mt-6 flex justify-between">
									<Button type="button" variant="outline" onClick={handleCancel}>
										Cancel
									</Button>
									<Button type="submit" className="bg-red-700 hover:bg-red-800">
										Login
									</Button>
								</div>
							</form>
						</TabsContent>

						{/* <TabsContent value="register">
							<form onSubmit={handleRegister}>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="register-name">Full Name</Label>
										<InputField id="register-name" icon={User} name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="register-email">Email</Label>
										<InputField id="register-email" icon={Mail} name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="register-username">Username</Label>
										<InputField id="register-username" icon={UserPlus} name="userName" type="text" placeholder="Choose a username" value={formData.userName} onChange={handleInputChange} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="register-password">Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
											<Input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Choose a password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10" />
											<button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
												{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
											</button>
										</div>
									</div>
								</div>
								<div className="mt-6 flex justify-between">
									<Button type="button" variant="outline" onClick={handleCancel}>
										Cancel
									</Button>
									<Button type="submit" className="bg-red-700 hover:bg-red-800">
										Register
									</Button>
								</div>
							</form>
						</TabsContent> */}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

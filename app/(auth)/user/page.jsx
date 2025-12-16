"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs"; // Import Tabs components
import { useRouter, useSearchParams } from "next/navigation";

const InputField = memo(({ id, icon: Icon, name, value, onChange, ...props }) => (
	<div className="relative">
		<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
		<Input id={id} name={name} value={value} onChange={onChange} {...props} className="pl-10" />
	</div>
));

InputField.displayName = "Input_Fields_User_Auth_Form";

export default function AuthForm() {
	const searchParams = useSearchParams();
	const initialEmail = searchParams.get("email") || "";
	const [formData, setFormData] = useState({
		fullName: "",
		email: initialEmail,
		userName: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const email = searchParams.get("email") || "";
		setFormData((prev) => (prev.email === email ? prev : { ...prev, email }));
	}, [searchParams]);

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
			setSubmitting(true);
			const response = await fetch("/api/user/login", {
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
			if (result?.success) {
				const role = result?.user?.role;
				const target = role === "parent" ? "/parents/dashboard" : "/dashboard";
				if (typeof window !== "undefined") {
					window.location.href = target;
				} else {
					router.push(target);
				}
			} else {
				const message = result?.error || result?.message || `Login failed (${response.status})`;
				setError(message || "Login failed. Please try again.");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError(error.message || "An unexpected error occurred. Please try again.");
		} finally {
			setSubmitting(false);
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
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="bg-green-700 text-slate-200 rounded-t-lg text-center">
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
				</CardHeader>
				<CardContent className="mt-6">
					{error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
									<Button type="submit" className="bg-green-700 hover:bg-orange-400" disabled={submitting}>
										{submitting ? "Logging in..." : "Login"}
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

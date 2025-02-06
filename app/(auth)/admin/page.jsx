"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthForm() {
	const [formData, setFormData] = useState({
		password: "",
	});
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleLogin = (e) => {
		e.preventDefault();
		console.log("Login attempted with:", { password: formData.password });
		if (formData.password === "gurungknsadmin1234") {
			router.push("/gurungknsadmin1234");
		} else {
			setError("Please enter correct password");
		}
	};

	const handleCancel = () => {
		setFormData({
			password: "",
		});
		setError("");
		router.push("/");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader className="bg-red-700 text-slate-200 rounded-t-lg">
					<CardTitle className="text-2xl font-bold text-center">Welcome to KNS Entertainment</CardTitle>
				</CardHeader>
				<CardContent className="mt-6">
					<div className="mb-6 flex justify-center">
						<Image src="/knslogo.png" alt="Auth" className="w-24 h-auto rounded-full" width={100} height={100} />
					</div>
					{error && <p className="text-red-500 mb-4">{error}</p>}

					<form onSubmit={handleLogin}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="login-password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter admin password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10" />
									<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
				</CardContent>
			</Card>
		</div>
	);
}

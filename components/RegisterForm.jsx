"use client";
import React, { memo, useCallback, useState } from "react";
import { Label } from "./ui/label";
import { Eye, EyeOff, Mail, User, UserPlus, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

const InputField = memo(({ id, icon: Icon, name, value, onChange, ...props }) => (
	<div className="relative">
		<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
		<Input id={id} name={name} value={value} onChange={onChange} {...props} className="pl-10" />
	</div>
));

InputField.displayName = "Input_Fields_User_Auth_Form";

const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		userName: "",
		password: "",
	});

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		console.log("Frontend bata: ", formData);
		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const result = await response.json();
			console.log(result);
			if (result.success) {
				setFormData({
					fullName: "",
					email: "",
					userName: "",
					password: "",
				});
				alert("User created successfully");
				router.push("/dashboard/");
			}
		} catch (error) {
			setError(error.message);
			console.error("Error Creating User:", error);
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
		router.push("/dashboard/");
	}, [router]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return (
		<form onSubmit={handleRegister}>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="register-name">Full Name</Label>
					<InputField id="register-name" icon={User} name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="register-email">Email</Label>
					<InputField id="register-email" icon={Mail} name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="register-username">Username</Label>
					<InputField id="register-username" icon={UserPlus} name="userName" type="text" placeholder="Choose a username" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="register-password">Password</Label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Choose a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-10" />
						<button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>
			</div>
			{error && <p className="mt-2 text-red-600">{error}</p>}
			<div className="mt-6 flex justify-between">
				<Button type="submit" className="bg-red-700 hover:bg-red-800">
					Register
				</Button>
				<Button type="button" variant="outline" onClick={handleCancel}>
					Close
				</Button>
			</div>
		</form>
	);
};

export default RegisterForm;

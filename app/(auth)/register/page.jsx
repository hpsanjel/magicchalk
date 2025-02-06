import React from "react";

const page = () => {
	return (
		<></>
		// const handleRegister = async (e) => {
		// 	e.preventDefault();
		// 	setError("");
		// 	console.log("Frontend bata: ", formData);

		// 	try {
		// 		const response = await fetch("/api/register", {
		// 			method: "POST",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 			body: JSON.stringify(formData),
		// 		});

		// 		const result = await response.json();
		// 		console.log(result);

		// 		if (result.success) {
		// 			setFormData({
		// 				fullName: "",
		// 				email: "",
		// 				userName: "",
		// 				password: "",
		// 			});

		// 			alert("User created successfully");
		// 			router.push("/user");
		// 		}
		// 	} catch (error) {
		// 		setError(error.message);
		// 		console.error("Error Creating User:", error);
		// 	}
		// };
		// <form onSubmit={handleRegister}>
		// 	<div className="space-y-4">
		// 		<div className="space-y-2">
		// 			<Label htmlFor="register-name">Full Name</Label>
		// 			<InputField id="register-name" icon={User} name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} />
		// 		</div>
		// 		<div className="space-y-2">
		// 			<Label htmlFor="register-email">Email</Label>
		// 			<InputField id="register-email" icon={Mail} name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
		// 		</div>
		// 		<div className="space-y-2">
		// 			<Label htmlFor="register-username">Username</Label>
		// 			<InputField id="register-username" icon={UserPlus} name="userName" type="text" placeholder="Choose a username" value={formData.userName} onChange={handleInputChange} />
		// 		</div>
		// 		<div className="space-y-2">
		// 			<Label htmlFor="register-password">Password</Label>
		// 			<div className="relative">
		// 				<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
		// 				<Input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="Choose a password" value={formData.password} onChange={handleInputChange} className="pl-10 pr-10" />
		// 				<button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
		// 					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
		// 				</button>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div className="mt-6 flex justify-between">
		// 		<Button type="button" variant="outline" onClick={handleCancel}>
		// 			Cancel
		// 		</Button>
		// 		<Button type="submit" className="bg-red-700 hover:bg-red-800">
		// 			Register
		// 		</Button>
		// 	</div>
		// </form>
	);
};

export default page;

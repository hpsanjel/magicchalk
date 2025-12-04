"use server";

import { revalidatePath } from "next/cache";
import Message from "@/models/Message.Model";
import connectDB from "@/lib/mongodb";

export async function submitMessage(formData: FormData) {
	try {
		await connectDB();

		const message = new Message({
			firstName: String(formData.get("firstName")),
			lastName: String(formData.get("lastName")),
			email: String(formData.get("email")),
			phone: String(formData.get("phone")),
			message: String(formData.get("message")),
		});

		console.log("Received data:", {
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			// ...
		});

		await message.save();

		revalidatePath("/contact");
		return { success: true, message: "Message sent successfully!" };
	} catch (error) {
		console.error("Error submitting message:", error);
		return { success: false, message: "Failed to send message. Please try again." };
	}
}

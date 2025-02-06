"use server";

import { revalidatePath } from "next/cache";
import Message from "@/models/Message.Model";
import connectDB from "@/lib/mongodb";

export async function submitMessage(formData: FormData) {
	try {
		await connectDB();

		const message = new Message({
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			email: formData.get("email"),
			phone: formData.get("phone"),
			country: formData.get("country"),
			message: formData.get("message"),
		});

		await message.save();

		revalidatePath("/contact");
		return { success: true, message: "Message sent successfully!" };
	} catch (error) {
		console.error("Error submitting message:", error);
		return { success: false, message: "Failed to send message. Please try again." };
	}
}

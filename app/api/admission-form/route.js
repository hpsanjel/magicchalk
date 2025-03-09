import connectDB from "@/lib/mongodb";
import AdmissionForm from "@/models/AdmissionForm.Model";

export async function POST(req) {
	await connectDB();

	try {
		const body = await req.json(); // Parse request body
		const formData = await AdmissionForm.create(body); // Save form data

		return Response.json(
			{
				success: true,
				message: "Application submitted successfully",
				data: formData,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error submitting form:", error);

		// Handle validation errors
		if (error.name === "ValidationError") {
			const validationErrors = Object.fromEntries(Object.entries(error.errors).map(([field, err]) => [field, err.message]));

			return Response.json(
				{
					success: false,
					message: "Validation failed",
					errors: validationErrors,
				},
				{ status: 400 }
			);
		}

		// Handle other errors
		return Response.json(
			{
				success: false,
				message: "Error submitting application",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

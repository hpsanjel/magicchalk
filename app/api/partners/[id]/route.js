import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner.Model";
import { uploadToCloudinary } from "@/utils/saveFileToCloudinaryUtils";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function PUT(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const formData = await request.formData();
		const partnerId = id;

		const partnerData = {};
		for (const [key, value] of formData.entries()) {
			if (key !== "partner_logo") {
				partnerData[key] = value;
			}
		}

		const partner_logo = formData.get("partner_logo");
		if (partner_logo) {
			partnerData.partner_logo = await uploadToCloudinary(partner_logo, "partner_images");
		}

		const updatedpartner = await Partner.findByIdAndUpdate(partnerId, partnerData, { new: true });

		if (!updatedpartner) {
			return NextResponse.json({ success: false, error: "partner not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, partner: updatedpartner }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const partnerId = id;

		const deletedpartner = await Partner.findByIdAndDelete(partnerId);

		if (!deletedpartner) {
			return NextResponse.json({ success: false, error: "partner not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: "partner deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET(request, { params }) {
	const { id } = await params;

	try {
		await connectDB();

		const partnerId = id;
		const partner = await Partner.findById(partnerId);

		if (!partner) {
			return NextResponse.json({ success: false, error: "partner not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, partner }, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student.Model";

const REQUIRED_FIELDS = ["firstName", "lastName", "dob", "classGroup", "enrollmentDate", "guardianName", "guardianPhone", "address", "emergencyContact"];

function normalizeDate(value) {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (id) {
			const student = await Student.findById(id);
			if (!student) {
				return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
			}
			return NextResponse.json({ success: true, student }, { status: 200 });
		}

		const students = await Student.find({}).sort({ createdAt: -1 });
		return NextResponse.json({ success: true, students }, { status: 200 });
	} catch (error) {
		console.error("Error fetching students:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await connectDB();
		const body = await request.json();
		const { students } = body || {};

		if (!Array.isArray(students)) {
			return NextResponse.json({ success: false, error: "Request body must include students array" }, { status: 400 });
		}

		const docs = [];
		const errors = [];

		students.forEach((row, index) => {
			const missing = REQUIRED_FIELDS.filter((field) => !row?.[field]);
			const dob = normalizeDate(row?.dob);
			const enrollmentDate = normalizeDate(row?.enrollmentDate);

			if (missing.length > 0 || !dob || !enrollmentDate) {
				errors.push({ index, reason: `Missing or invalid fields: ${[...missing, !dob && "dob", !enrollmentDate && "enrollmentDate"].filter(Boolean).join(", ")}` });
				return;
			}

			docs.push({
				firstName: row.firstName,
				lastName: row.lastName,
				dob,
				gender: row.gender || "",
				guardianName: row.guardianName,
				guardianPhone: row.guardianPhone,
				guardianEmail: row.guardianEmail?.trim() || undefined,
				address: row.address,
				classGroup: row.classGroup,
				enrollmentDate,
				allergies: row.allergies || "",
				medicalNotes: row.medicalNotes || "",
				transportRoute: row.transportRoute || "",
				pickupPerson: row.pickupPerson || "",
				emergencyContact: row.emergencyContact,
			});
		});

		if (docs.length === 0) {
			return NextResponse.json({ success: false, inserted: 0, errors }, { status: 400 });
		}

		const created = await Student.insertMany(docs, { ordered: false });

		return NextResponse.json({ success: true, inserted: created.length, errors }, { status: errors.length ? 207 : 201 });
	} catch (error) {
		console.error("Error saving students:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		await connectDB();
		const body = await request.json();
		const { id, student } = body || {};

		if (!id || !student) {
			return NextResponse.json({ success: false, error: "Request must include id and student payload" }, { status: 400 });
		}

		const missing = REQUIRED_FIELDS.filter((field) => !student?.[field]);
		const dob = normalizeDate(student?.dob);
		const enrollmentDate = normalizeDate(student?.enrollmentDate);
		if (missing.length > 0 || !dob || !enrollmentDate) {
			return NextResponse.json({ success: false, error: `Missing or invalid fields: ${[...missing, !dob && "dob", !enrollmentDate && "enrollmentDate"].filter(Boolean).join(", ")}` }, { status: 400 });
		}

		const update = {
			firstName: student.firstName,
			lastName: student.lastName,
			dob,
			gender: student.gender || "",
			guardianName: student.guardianName,
			guardianPhone: student.guardianPhone,
			guardianEmail: student.guardianEmail?.trim() || undefined,
			address: student.address,
			classGroup: student.classGroup,
			enrollmentDate,
			allergies: student.allergies || "",
			medicalNotes: student.medicalNotes || "",
			transportRoute: student.transportRoute || "",
			pickupPerson: student.pickupPerson || "",
			emergencyContact: student.emergencyContact,
		};

		const updated = await Student.findByIdAndUpdate(id, update, { new: true });
		if (!updated) {
			return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, student: updated }, { status: 200 });
	} catch (error) {
		console.error("Error updating student:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

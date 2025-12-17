"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

function formatDate(value?: string) {
	if (!value) return "-";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleDateString();
}

export default function StudentDetailPage() {
	const params = useParams();
	const router = useRouter();
	const id = params?.id as string;
	const [student, setStudent] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		let ignore = false;
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const res = await fetch(`/api/students?id=${id}`);
				const data = await res.json();
				if (!res.ok || !data?.success) {
					throw new Error(data?.error || "Failed to load student");
				}
				if (!ignore) setStudent(data.student || null);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load student";
				setError(message);
				toast({ title: "Load failed", description: message });
			} finally {
				if (!ignore) setLoading(false);
			}
		};
		if (id) load();
		return () => {
			ignore = true;
		};
	}, [id]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-semibold text-gray-900">Student detail</h1>
					<p className="text-sm text-gray-500">Record for {student ? `${student.firstName} ${student.lastName}` : "..."}</p>
				</div>
				<button className="text-sm font-semibold text-gray-600" onClick={() => router.back()}>
					← Back
				</button>
			</div>

			{loading ? (
				<div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-600">Loading…</div>
			) : error ? (
				<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
			) : !student ? (
				<div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-600">Student not found.</div>
			) : (
				<div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Name</h3>
							<p className="text-gray-900">
								{student.firstName} {student.lastName}
							</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Class</h3>
							<p className="text-gray-900">{student.classGroup || "-"}</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Enrollment date</h3>
							<p className="text-gray-900">{formatDate(student.enrollmentDate)}</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Date of birth</h3>
							<p className="text-gray-900">{formatDate(student.dob)}</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Guardian</h3>
							<p className="text-gray-900">{student.guardianName || "-"}</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Contacts</h3>
							<div className="text-sm text-gray-800 space-y-1">
								{student.guardianPhone && <div>📞 {student.guardianPhone}</div>}
								{student.guardianEmail && <div>✉️ {student.guardianEmail}</div>}
								<div>Emergency: {student.emergencyContact || "-"}</div>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Transport</h3>
							<p className="text-gray-900">{student.transportRoute || "-"}</p>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Pickup person</h3>
							<p className="text-gray-900">{student.pickupPerson || "-"}</p>
						</div>
						<div className="md:col-span-2">
							<h3 className="text-sm font-semibold text-gray-800">Allergies</h3>
							<p className="text-gray-900">{student.allergies || "None"}</p>
						</div>
						<div className="md:col-span-2">
							<h3 className="text-sm font-semibold text-gray-800">Medical notes</h3>
							<p className="text-gray-900">{student.medicalNotes || "None"}</p>
						</div>
					</div>
					<div className="mt-6 flex justify-end gap-3 text-sm">
						<Link href={`/dashboard/students?id=${id}`} className="text-gray-700 hover:text-gray-900">
							Edit
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

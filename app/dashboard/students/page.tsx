"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type CsvRow = string[];
type ParsedCsv = { headers: string[]; rows: CsvRow[] };
type StudentUploadResult = { inserted: number; errors: { index: number; reason: string }[] };

const REQUIRED_HEADERS = ["firstName", "lastName", "dob", "gender", "guardianName", "guardianPhone", "guardianEmail", "address", "classGroup", "enrollmentDate", "allergies", "medicalNotes", "transportRoute", "pickupPerson", "emergencyContact"];

// Minimal CSV parser that supports quoted fields and newlines inside quotes.
function parseCsv(content: string): CsvRow[] {
	const rows: CsvRow[] = [];
	let current: string[] = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < content.length; i += 1) {
		const char = content[i];
		const next = content[i + 1];

		if (char === '"') {
			if (inQuotes && next === '"') {
				field += '"';
				i += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === "," && !inQuotes) {
			current.push(field);
			field = "";
			continue;
		}

		if ((char === "\n" || char === "\r") && !inQuotes) {
			if (field !== "" || current.length > 0) {
				current.push(field);
				rows.push(current);
				current = [];
				field = "";
			}
			continue;
		}

		field += char;
	}

	if (field !== "" || current.length > 0) {
		current.push(field);
		rows.push(current);
	}

	return rows.filter((r) => r.length > 0);
}

function parseCsvToObjects(content: string): ParsedCsv | null {
	const rows = parseCsv(content);
	if (rows.length < 2) return null;
	const headers = rows[0].map((h) => h.trim());
	const dataRows = rows.slice(1).filter((r) => r.some((cell) => cell.trim() !== ""));
	const mapped = dataRows.map((r) => headers.map((_, idx) => r[idx]?.trim() ?? ""));
	return { headers, rows: mapped };
}

async function parseXlsxToObjects(file: File): Promise<ParsedCsv | null> {
	const XLSX = await import("xlsx");
	const buffer = await file.arrayBuffer();
	const workbook = XLSX.read(buffer, { type: "array" });
	const sheetName = workbook.SheetNames[0];
	if (!sheetName) return null;
	const sheet = workbook.Sheets[sheetName];
	const rows = (XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as CsvRow[]) || [];
	if (rows.length < 2) return null;
	const headers = rows[0].map((h) => String(h ?? "").trim());
	const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell ?? "").trim() !== ""));
	const mapped = dataRows.map((r) => headers.map((_, idx) => String(r[idx] ?? "").trim()));
	return { headers, rows: mapped };
}

function alignHeaders(headers: string[]) {
	const normalized = headers.map((h) => h.trim());
	const missing = REQUIRED_HEADERS.filter((req) => !normalized.some((h) => h.toLowerCase() === req.toLowerCase()));
	const canonical = normalized.map((h) => REQUIRED_HEADERS.find((req) => req.toLowerCase() === h.toLowerCase()) || h);
	return { canonical, missing };
}

const sampleStudents = [
	{
		firstName: "Ava",
		lastName: "Johnson",
		dob: "2019-03-12",
		gender: "Female",
		guardianName: "Emily Johnson",
		guardianPhone: "+1-555-123-4567",
		guardianEmail: "emily.johnson@example.com",
		address: "123 Maple St, Springfield",
		classGroup: "Pre-K A",
		enrollmentDate: "2025-01-08",
		allergies: "Peanuts",
		medicalNotes: "Carries epi-pen",
		transportRoute: "Route A",
		pickupPerson: "Grandma Sarah",
		emergencyContact: "+1-555-987-6543",
	},
	{
		firstName: "Liam",
		lastName: "Carter",
		dob: "2018-11-02",
		gender: "Male",
		guardianName: "Michael Carter",
		guardianPhone: "+1-555-222-7890",
		guardianEmail: "m.carter@example.com",
		address: "78 Pine Ave, Springfield",
		classGroup: "Kindergarten B",
		enrollmentDate: "2025-01-08",
		allergies: "None",
		medicalNotes: "N/A",
		transportRoute: "Route B",
		pickupPerson: "Dad",
		emergencyContact: "+1-555-333-2468",
	},
];

const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500";
const labelClass = "text-sm font-semibold text-gray-800";
const sectionCardClass = "rounded-xl border border-gray-100 bg-white shadow-sm p-5";

function emptyFormState() {
	return {
		firstName: "",
		lastName: "",
		dob: "",
		gender: "",
		guardianName: "",
		guardianPhone: "",
		guardianEmail: "",
		address: "",
		classGroup: "",
		enrollmentDate: "",
		allergies: "",
		medicalNotes: "",
		transportRoute: "",
		pickupPerson: "",
		emergencyContact: "",
	};
}

function formatDateForInput(value?: string) {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().slice(0, 10);
}

export default function StudentsAdminPage() {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [selectedFileName, setSelectedFileName] = useState<string>("");
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string>("");
	const [uploadResult, setUploadResult] = useState<StudentUploadResult | null>(null);
	const [singleSaving, setSingleSaving] = useState(false);
	const [singleForm, setSingleForm] = useState(emptyFormState);
	const [editingId, setEditingId] = useState<string>("");
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [classes, setClasses] = useState<{ _id: string; name: string }[]>([]);
	const [classesError, setClassesError] = useState<string>("");
	const isEditing = Boolean(editingId);
	const sampleCsv = useMemo(() => {
		const headers = Object.keys(sampleStudents[0]);
		const rows = sampleStudents.map((row) => headers.map((key) => JSON.stringify(row[key as keyof typeof row] ?? ""))); // keep commas inside values safe
		return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
	}, []);
	const router = useRouter();
	const classOptions = useMemo(() => {
		const names = classes.map((c) => c.name);
		if (singleForm.classGroup && !names.includes(singleForm.classGroup)) {
			return [singleForm.classGroup, ...names];
		}
		return names;
	}, [classes, singleForm.classGroup]);

	useEffect(() => {
		const idParam = searchParams.get("id");
		if (!idParam) {
			setEditingId("");
			setSingleForm(emptyFormState());
			return;
		}

		setActiveTab("single");
		setEditingId(idParam);
		setLoadingEdit(true);
		(async () => {
			try {
				const res = await fetch(`/api/students?id=${idParam}`);
				const data = await res.json();
				if (!res.ok || !data?.success) {
					throw new Error(data?.error || "Failed to load student");
				}
				const s = data.student || {};
				setSingleForm({
					firstName: s.firstName || "",
					lastName: s.lastName || "",
					dob: formatDateForInput(s.dob),
					gender: s.gender || "",
					guardianName: s.guardianName || "",
					guardianPhone: s.guardianPhone || "",
					guardianEmail: s.guardianEmail || "",
					address: s.address || "",
					classGroup: s.classGroup || "",
					enrollmentDate: formatDateForInput(s.enrollmentDate),
					allergies: s.allergies || "",
					medicalNotes: s.medicalNotes || "",
					transportRoute: s.transportRoute || "",
					pickupPerson: s.pickupPerson || "",
					emergencyContact: s.emergencyContact || "",
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load student";
				toast({ title: "Load failed", description: message });
				setEditingId("");
			} finally {
				setLoadingEdit(false);
			}
		})();
	}, [searchParams]);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				setClassesError("");
				const res = await fetch("/api/classes");
				const data = await res.json();
				if (!res.ok || !data?.success || !Array.isArray(data.classes)) {
					throw new Error(data?.error || "Unable to load classes");
				}
				if (!ignore) {
					setClasses(data.classes);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load classes";
				if (!ignore) setClassesError(message);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	const handleDownloadSample = () => {
		const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "parents-students-sample.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleClickUpload = () => {
		fileInputRef.current?.click();
	};

	const handleSingleChange = (field: keyof typeof singleForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setSingleForm((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const handleSaveSingle = async () => {
		const required = ["firstName", "lastName", "dob", "classGroup", "enrollmentDate", "guardianName", "guardianPhone", "address", "emergencyContact"] as const;
		const missing = required.filter((field) => !singleForm[field]);
		if (missing.length) {
			const message = `Please fill required fields: ${missing.join(", ")}`;
			toast({ title: "Missing fields", description: message });
			return;
		}

		setSingleSaving(true);
		try {
			const studentPayload = {
				...singleForm,
				guardianEmail: singleForm.guardianEmail.trim() || undefined,
			};

			if (isEditing) {
				const response = await fetch("/api/students", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: editingId, student: studentPayload }),
				});
				const data = await response.json();
				if (!response.ok || !data?.success) {
					const message = data?.error || `Could not update student (status ${response.status}).`;
					toast({ title: "Update failed", description: message });
					return;
				}
				toast({ title: "Student updated", description: "Changes saved successfully." });
				router.push(`/dashboard/students/${editingId}`);
			} else {
				const payload = { students: [studentPayload] };
				const response = await fetch("/api/students", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				const data = await response.json();
				if (!response.ok || !data?.success) {
					const firstError = Array.isArray(data?.errors) && data.errors.length ? data.errors[0].reason : null;
					const message = data?.error || firstError || `Could not save student (status ${response.status}).`;
					toast({ title: "Save failed", description: message });
					return;
				}
				toast({ title: "Student saved", description: "Student was added successfully." });
				setSingleForm(emptyFormState());
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected error while saving.";
			toast({ title: "Save failed", description: message });
		} finally {
			setSingleSaving(false);
		}
	};

	const processUpload = async (file: File) => {
		setUploadError("");
		setUploadResult(null);
		setSelectedFileName(file.name);

		const isCsv = file.name.toLowerCase().endsWith(".csv");
		const isXlsx = file.name.toLowerCase().endsWith(".xlsx");
		if (!isCsv && !isXlsx) {
			const message = "Only CSV or XLSX uploads are supported.";
			setUploadError(message);
			toast({ title: "Upload failed", description: message });
			return;
		}

		const parsed = isCsv ? await (async () => parseCsvToObjects(await file.text()))() : await parseXlsxToObjects(file);
		if (!parsed) {
			const message = "Could not read rows. Please check the file.";
			setUploadError(message);
			toast({ title: "Upload failed", description: message });
			return;
		}

		if (parsed.headers.length === 0) {
			const message = "File is missing headers.";
			setUploadError(message);
			toast({ title: "Upload failed", description: message });
			return;
		}

		const { canonical, missing } = alignHeaders(parsed.headers);
		if (missing.length > 0) {
			const message = `Missing required headers: ${missing.join(", ")}`;
			setUploadError(message);
			toast({ title: "Upload failed", description: message });
			return;
		}

		const students = parsed.rows.map((row) => {
			const obj: Record<string, string> = {};
			canonical.forEach((header, idx) => {
				obj[header] = row[idx] ?? "";
			});
			return obj;
		});

		if (students.length === 0) {
			setUploadError("No data rows found in CSV.");
			return;
		}

		setUploading(true);
		try {
			const response = await fetch("/api/students", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ students }),
			});
			const data = await response.json();
			if (!response.ok && !data?.success) {
				const message = data?.error || "Upload failed. Please try again.";
				setUploadError(message);
				toast({ title: "Upload failed", description: message });
			} else {
				const result = { inserted: data.inserted ?? 0, errors: data.errors || [] };
				setUploadResult(result);
				toast({ title: "Upload complete", description: `Inserted ${result.inserted} student${result.inserted === 1 ? "" : "s"}${result.errors.length ? `, ${result.errors.length} failed` : ""}.` });
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected error during upload.";
			setUploadError(message);
			toast({ title: "Upload failed", description: message });
		} finally {
			setUploading(false);
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			processUpload(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			processUpload(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b border-gray-100 bg-white">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-500">Students</p>
						<h1 className="text-2xl font-semibold text-gray-900">{isEditing ? "Update Student" : "Add New Students"}</h1>
						<p className="text-sm text-gray-500">{isEditing ? "Edit details for the selected student." : "Single entry or bulk import for kindergarten students."}</p>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
				<div className="flex flex-wrap gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
					<button onClick={() => setActiveTab("single")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "single" ? "bg-green-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>
						Add single student
					</button>
					<button onClick={() => setActiveTab("bulk")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "bulk" ? "bg-green-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>
						Bulk upload
					</button>
				</div>

				{activeTab === "single" && (
					<section className={sectionCardClass}>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">{isEditing ? "Update student" : "Single student"}</h2>
						</div>
						{isEditing && <p className="mb-2 text-sm text-gray-600">Loaded from student record. Adjust fields and click Update student.</p>}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<label className={labelClass}>First name *</label>
								<input className={inputClass} placeholder="Ava" value={singleForm.firstName} onChange={handleSingleChange("firstName")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Last name *</label>
								<input className={inputClass} placeholder="Johnson" value={singleForm.lastName} onChange={handleSingleChange("lastName")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Date of birth *</label>
								<input type="date" className={inputClass} value={singleForm.dob} onChange={handleSingleChange("dob")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Gender</label>
								<select className={inputClass} value={singleForm.gender} onChange={handleSingleChange("gender")}>
									<option value="">Select gender</option>
									<option>Female</option>
									<option>Male</option>
									<option>Non-binary</option>
									<option>Prefer not to say</option>
								</select>
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Class / Group *</label>
								<select className={inputClass} value={singleForm.classGroup} onChange={handleSingleChange("classGroup")}>
									<option value="">Select class</option>
									{classOptions.map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
								{classesError && <p className="text-xs text-red-600">{classesError}</p>}
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Enrollment date *</label>
								<input type="date" className={inputClass} value={singleForm.enrollmentDate} onChange={handleSingleChange("enrollmentDate")} />
							</div>
							<div className="space-y-1 md:col-span-2">
								<label className={labelClass}>Home address *</label>
								<input className={inputClass} placeholder="123 Maple St, Springfield" value={singleForm.address} onChange={handleSingleChange("address")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Guardian name *</label>
								<input className={inputClass} placeholder="Emily Johnson" value={singleForm.guardianName} onChange={handleSingleChange("guardianName")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Guardian phone *</label>
								<input className={inputClass} placeholder="+1-555-123-4567" value={singleForm.guardianPhone} onChange={handleSingleChange("guardianPhone")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Guardian email</label>
								<input className={inputClass} placeholder="guardian@example.com" value={singleForm.guardianEmail} onChange={handleSingleChange("guardianEmail")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Emergency contact *</label>
								<input className={inputClass} placeholder="+1-555-987-6543" value={singleForm.emergencyContact} onChange={handleSingleChange("emergencyContact")} />
							</div>
							<div className="space-y-1 md:col-span-2">
								<label className={labelClass}>Authorized pickup person</label>
								<input className={inputClass} placeholder="Grandma Sarah" value={singleForm.pickupPerson} onChange={handleSingleChange("pickupPerson")} />
							</div>
							<div className="space-y-1 md:col-span-2">
								<label className={labelClass}>Allergies</label>
								<textarea className={inputClass} rows={2} placeholder="Peanuts" value={singleForm.allergies} onChange={handleSingleChange("allergies")} />
							</div>
							<div className="space-y-1 md:col-span-2">
								<label className={labelClass}>Medical notes</label>
								<textarea className={inputClass} rows={2} placeholder="Carries epi-pen" value={singleForm.medicalNotes} onChange={handleSingleChange("medicalNotes")} />
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Transport route</label>
								<select className={inputClass} value={singleForm.transportRoute} onChange={handleSingleChange("transportRoute")}>
									<option value="">Select route</option>
									<option>Route A</option>
									<option>Route B</option>
									<option>Route C</option>
								</select>
							</div>
							<div className="space-y-1">
								<label className={labelClass}>Preferred pickup time</label>
								<input className={inputClass} placeholder="3:00 PM" />
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50" onClick={handleSaveSingle} disabled={singleSaving || loadingEdit}>
								{singleSaving ? (isEditing ? "Updating..." : "Saving...") : isEditing ? "Update student" : "Save student"}
							</button>
						</div>
					</section>
				)}

				{activeTab === "bulk" && (
					<section className={sectionCardClass}>
						<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Bulk upload</h2>
							<div className="flex flex-wrap gap-2">
								<button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={handleDownloadSample}>
									Download sample CSV
								</button>
								<button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700" onClick={handleClickUpload}>
									Upload file
								</button>
								<input ref={fileInputRef} type="file" className="hidden" accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={handleFileChange} />
							</div>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							<div></div>
							{/* <div className="space-y-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
								<p className="text-sm font-semibold text-gray-800">Required headers</p>
								<div className="flex flex-wrap gap-2 text-xs">
									{Object.keys(sampleStudents[0]).map((key) => (
										<span key={key} className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 border border-gray-200">
											{key}
										</span>
									))}
								</div>
							</div> */}
							<div className="space-y-3 rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
								<p className="text-sm font-semibold text-gray-800">Attach file</p>
								<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600" onDrop={handleDrop} onDragOver={handleDragOver}>
									<p className="mb-2">Drop your .csv or .xlsx here, or use Upload file.</p>
									{selectedFileName ? <span className="text-xs text-green-700 font-semibold">Selected: {selectedFileName}</span> : <span className="text-xs text-gray-500">No file chosen</span>}
									{uploading && <p className="mt-2 text-xs text-gray-500">Uploading…</p>}
									{uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
									{uploadResult && (
										<div className="mt-2 text-xs text-left text-gray-700">
											<p className="font-semibold text-green-700">Inserted: {uploadResult.inserted}</p>
											{uploadResult.errors.length > 0 && (
												<ul className="mt-1 list-disc space-y-1 pl-4 text-red-600">
													{uploadResult.errors.slice(0, 5).map((err) => (
														<li key={err.index}>
															Row {err.index + 2}: {err.reason}
														</li>
													))}
													{uploadResult.errors.length > 5 && <li>+{uploadResult.errors.length - 5} more…</li>}
												</ul>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</section>
				)}
			</main>
		</div>
	);
}

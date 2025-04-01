"use client";
import { useState } from "react";
import useFetchData from "@/hooks/useFetchData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Printer, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function SubscribersPage() {
	const [deleteId, setDeleteId] = useState(null);
	const { data: admissions, error, loading, mutate } = useFetchData("/api/admissions", "admissions");
	const handlePrint = (data) => {
		// Create a new window to hold the printable content
		const printWindow = window.open("", "", "width=800,height=600");

		// Define the content for printing
		const content = `
		  <html>
			<head>
			  <style>
				@page {
				  size: A4;
				  margin: 20mm;
				}
				body {
				  font-family: Arial, sans-serif;
				  margin: 0;
				  padding: 0;
				}
				.print-container {
				  width: 100%;
				  margin: auto;
				  padding: 20px;
				  text-align: center;
				}
				.print-table {
				  width: 100%;
				  border-collapse: collapse;
				}
				.print-table th, .print-table td {
				  border: 1px solid #ddd;
				  padding: 8px;
				  text-align: left;
				}
			  </style>
			</head>
			<body>
			  <div class="print-container">
				<h2>Admission Application Details</h2>
				<table class="print-table">
				  <tr>
					<th>Name</th>
					<td>${data.childName}</td>
				  </tr>
				  <tr>
					<th>Position</th>
					<td>${data.address}</td>
				  </tr>
				  <tr>
					<th>Email</th>
					<td>${data.email}</td>
				  </tr>
				</table>
			  </div>
			</body>
		  </html>
		`;

		// Write the content to the new window
		printWindow.document.write(content);
		printWindow.document.close();

		// Trigger the print dialog
		printWindow.print();
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`/api/admissions/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete admission");
			}
			toast.success("Admission deleted successfully!");
			mutate();
		} catch (error) {
			// console.error("Error deleting admission:", error);
			toast.error("Failed to delete admission. Please try again.", error);
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	return (
		<div className="max-w-2xl space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>
						Total Applications for Admission: <span className="text-2xl font-bold text-green-700 bg-slate-100 px-2 py-1 rounded-full">{admissions?.length}</span>
					</CardTitle>
					<CardDescription>Manage, View and Print admission applications.</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Applicant</TableHead>
								<TableHead>Applied on</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{admissions &&
								admissions.map((admission) => (
									<TableRow key={admission._id}>
										<TableCell className="font-medium">
											<div className="flex items-center space-x-4">
												<div>
													<div className="font-bold">{admission?.childName || ""}</div>
												</div>
											</div>
										</TableCell>
										<TableCell>{format(new Date(admission?.submittedAt), "PP")}</TableCell>

										<TableCell>
											<Button variant="ghost" size="icon" onClick={() => setDeleteId(admission._id)}>
												<Trash2 className="h-4 w-4 text-red-700" />
											</Button>

											<Button variant="ghost" size="icon" onClick={() => handlePrint(admission)}>
												<Printer className="h-4 w-4 text-green-700" />
											</Button>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
					<AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
						{/* <div className="fixed inset-0 bg-black bg-opacity-60"></div> */}
						<AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>This action cannot be undone. This will permanently delete the admission from your database.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => handleDelete(deleteId)}>Yes, Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	);
}

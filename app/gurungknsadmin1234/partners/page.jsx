"use client";

import React, { useState } from "react";
import useFetchData from "@/hooks/useFetchData";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import PartnerForm from "@/components/PartnerForm";

export default function EventsPage() {
	const [openPartnerModal, setOpenPartnerModal] = useState(false);
	const [partnerToEdit, setPartnerToEdit] = useState(null);
	const { data: partners, error, loading, mutate } = useFetchData("/api/partners", "partners");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const handleEdit = (partner) => {
		setPartnerToEdit(partner);
		setOpenPartnerModal(true);
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`/api/partners/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete partner");
			}
			mutate();
		} catch (error) {
			console.error("Error deleting partner:", error);
			alert("Failed to delete partner. Please try again.");
		}
	};

	const handleClosePartnerModal = () => {
		setOpenPartnerModal(false);
		setPartnerToEdit(null);
		mutate();
	};

	const handleCreatePartner = () => {
		setPartnerToEdit(null);
		setOpenPartnerModal(true);
	};

	return (
		<div className="max-w-3xl">
			<div className="text-right">
				<button onClick={handleCreatePartner} className="bg-red-800 text-slate-200 font-bold px-4 py-2 my-4">
					Create Partner
				</button>
			</div>
			<div className=" bg-white rounded-lg shadow">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Partner Name</TableHead>
							<TableHead>Partner URL</TableHead>
							<TableHead>Partner Logo</TableHead>
							<TableHead>Alternative Text</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{partners?.length > 0 ? (
							partners.map((partner) => (
								<TableRow key={partner._id}>
									<TableCell className="font-semibold">{partner.partner_name}</TableCell>
									<TableCell>{partner.partner_url}</TableCell>
									<TableCell>
										<Image src={partner.partner_logo || "/placeholder.jpg"} width={200} height={200} alt={partner.partner_name || "alt"} className="w-16 h-16 rounded-full object-cover" />
									</TableCell>
									<TableCell>{partner.logo_alt_text}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button variant="ghost" size="icon" onClick={() => handleEdit(partner)}>
												<Pencil className="w-6 h-6 text-blue-700" />
											</Button>
											<Button variant="ghost" size="icon" onClick={() => handleDelete(partner._id)}>
												<Trash2 className="w-6 h-6 text-red-700" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No partners found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{openPartnerModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-lg font-bold text-slate-200 bg-red-700 p-4 mb-6 text-center">{partnerToEdit ? "Edit Partner" : "Create Partner"}</h2>
						<PartnerForm handleClosePartnerModal={handleClosePartnerModal} partnerToEdit={partnerToEdit} fetchPartners={partners} />
					</div>
				</div>
			)}
		</div>
	);
}

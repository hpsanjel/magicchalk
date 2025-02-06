import { useEffect, useState } from "react";

export default function PartnerForm({ handleClosePartnerModal, partnerToEdit = null }) {
	const [formData, setFormData] = useState({
		partner_name: "",
		partner_url: "",
		partner_logo: "",
		logo_alt_text: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (partnerToEdit) {
			setFormData({
				...partnerToEdit,
				partner_logo: null,
			});
		}
	}, [partnerToEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);

		try {
			const form = new FormData();
			Object.keys(formData).forEach((key) => {
				if (key !== "partner_logo" || (key === "partner_logo" && formData[key])) {
					form.append(key, formData[key]);
				}
			});

			const url = partnerToEdit ? `/api/partners/${partnerToEdit._id}` : "/api/partners/create";
			const method = partnerToEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				body: form,
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || `Failed to ${partnerToEdit ? "update" : "create"} partner`);
			}

			if (result.success) {
				setFormData({
					partner_name: "",
					partner_url: "",
					partner_logo: "",
					logo_alt_text: "",
				});
				// Reset eventposter input
				// const eventposterInput = document.getElementById("eventposter");
				// if (eventposterInput) {
				// 	eventposterInput.value = "";
				// }
				alert(`Partner ${partnerToEdit ? "updated" : "created"} successfully!`);
				handleClosePartnerModal();
			}
		} catch (error) {
			setError(error.message);
			console.error(`Error ${eventToEdit ? "updating" : "creating"} event:`, error);
		} finally {
			setSubmitting(false);
		}
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	setError("");
	// 	setSubmitting(true);

	// 	try {
	// 		const form = new FormData();
	// 		form.append("partner_name", formData.partner_name);
	// 		form.append("partner_url", formData.partner_url);
	// 		if (formData.partner_logo) {
	// 			form.append("partner_logo", formData.partner_logo);
	// 		}
	// 		form.append("logo_alt_text", formData.logo_alt_text);

	// 		console.log("form", form);
	// 		const response = await fetch("/api/partners/create", {
	// 			method: "POST",
	// 			body: form,
	// 		});

	// 		const result = await response.json();
	// 		console.log("result", result);

	// 		if (!response.ok) {
	// 			throw new Error(result.error || "Failed to create partner");
	// 		}

	// 		if (result.success) {
	// 			fetchPartners();
	// 			setFormData({
	// 				partner_name: "",
	// 				partner_url: "",
	// 				partner_logo: "",
	// 				logo_alt_text: "",
	// 			});
	// 		}
	// 	} catch (error) {
	// 		setError(error.message);
	// 		console.error("Error saving partner:", error);
	// 	} finally {
	// 		setSubmitting(false);
	// 	}
	// };

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
			<div>
				<label htmlFor="partner_name" className="block mb-2 font-bold">
					Name of Partner
				</label>
				<input type="text" id="partner_name" value={formData.partner_name} onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })} className="w-full p-2 border rounded" required />
			</div>
			<div>
				<label htmlFor="partner_url" className="block mb-2 font-bold">
					Partner URL
				</label>
				<input type="text" id="partner_url" value={formData.partner_url} onChange={(e) => setFormData({ ...formData, partner_url: e.target.value })} className="w-full p-2 border rounded" required />
			</div>
			<div>
				<label htmlFor="partner_logo" className="block mb-2 font-bold">
					Partner Logo
				</label>
				<input type="file" id="partner_logo" onChange={(e) => setFormData({ ...formData, partner_logo: e.target.files[0] })} className="w-full p-2 border rounded" required />
			</div>
			<div>
				<label htmlFor="logo_alt_text" className="block mb-2 font-bold">
					Alternative Text
				</label>
				<input type="text" id="logo_alt_text" value={formData.logo_alt_text} onChange={(e) => setFormData({ ...formData, logo_alt_text: e.target.value })} className="w-full p-2 border rounded" required />
			</div>

			<div className="grid grid-cols-2 gap-2">
				<button type="submit" disabled={submitting} className={`w-full p-1.5 rounded ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} text-slate-200 font-bold`}>
					{submitting ? `${partnerToEdit ? "Updating" : "Creating"} partner...` : `${partnerToEdit ? "Update" : "Create"} Partner`}
				</button>
				<button type="button" onClick={handleClosePartnerModal} className="w-full p-1.5 rounded border text-red-600 font-bold hover:bg-gray-100">
					Close
				</button>
			</div>
		</form>
	);
}

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function EventForm({ handleCloseEventModal, eventToEdit = null }) {
	const [formData, setFormData] = useState({
		eventname: "",
		eventdescription: "",
		eventcountry: "",
		eventvenue: "",
		eventdate: "",
		earlyBirdPrice: "",
		vipPrice: "",
		standardPrice: "",
		frontRowPrice: "",
		backRowPrice: "",
		preSalePrice: "",
		doorSalePrice: "",
		eventtime: "",
		eventspotifyUrl: "",
		eventyoutubeUrl: "",
		eventposter: null,
		eventposter2: null,
		eventposter3: null,
		eventvideo: null,
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (eventToEdit) {
			setFormData({
				...eventToEdit,
				eventdate: eventToEdit.eventdate.split("T")[0], // Format date for input
				eventposter: null, // Clear file input
				eventposter2: null, // Clear file input
				eventposter3: null, // Clear file input
				eventvideo: null,
			});
		}
	}, [eventToEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);

		try {
			const form = new FormData();
			// Object.keys(formData).forEach((key) => {
			// 	if (key !== "eventposter" || (key === "eventposter" && formData[key])) {
			// 		form.append(key, formData[key]);
			// 	}
			// });
			Object.keys(formData).forEach((key) => {
				// Append only non-null, non-undefined values
				if (formData[key]) {
					form.append(key, formData[key]);
				}
			});

			const url = eventToEdit ? `/api/events/${eventToEdit._id}` : "/api/events/create";
			const method = eventToEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				body: form,
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || `Failed to ${eventToEdit ? "update" : "create"} event`);
			}

			if (result.success) {
				setFormData({
					eventname: "",
					eventdescription: "",
					eventcountry: "",
					eventvenue: "",
					eventdate: "",
					earlyBirdPrice: "",
					vipPrice: "",
					standardPrice: "",
					frontRowPrice: "",
					backRowPrice: "",
					preSalePrice: "",
					doorSalePrice: "",
					eventtime: "",
					eventspotifyUrl: "",
					eventyoutubeUrl: "",
					eventposter: null,
					eventposter2: null,
					eventposter3: null,
					eventvideo: null,
				});
				// Reset eventposter input
				const eventposterInput = document.getElementById("eventposter");
				if (eventposterInput) {
					eventposterInput.value = "";
				}
				const eventposterInput2 = document.getElementById("eventposter2");
				if (eventposterInput2) {
					eventposterInput2.value = "";
				}
				const eventposterInput3 = document.getElementById("eventposter3");
				if (eventposterInput3) {
					eventposterInput3.value = "";
				}
				const eventvideoInput = document.getElementById("eventvideo");
				if (eventvideoInput) {
					eventvideoInput.value = "";
				}
				alert(`Event ${eventToEdit ? "updated" : "created"} successfully!`);
				handleCloseEventModal();
			}
		} catch (error) {
			setError(error.message);
			console.error(`Error ${eventToEdit ? "updating" : "creating"} event:`, error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="max-h-[calc(100vh-200px)] overflow-y-auto">
			<form onSubmit={handleSubmit} className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-6">
				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
				<div>
					<label htmlFor="eventname" className="block mb-2 font-bold">
						Name of Event
					</label>
					<input type="text" id="eventname" value={formData.eventname} onChange={(e) => setFormData({ ...formData, eventname: e.target.value })} className="w-full p-2 border rounded" required />
				</div>
				<div>
					<label htmlFor="eventdescription" className="block mb-2 font-bold">
						Description of Event
					</label>
					<textarea id="eventdescription" value={formData.eventdescription} onChange={(e) => setFormData({ ...formData, eventdescription: e.target.value })} className="w-full p-2 border rounded" rows={3} required />

					{/* <input type="text" id="eventdescription" value={formData.eventdescription} onChange={(e) => setFormData({ ...formData, eventdescription: e.target.value })} className="w-full p-2 border rounded" /> */}
				</div>
				<div>
					<label htmlFor="eventcountry" className="block mb-2 font-bold">
						Event Country
					</label>
					<input id="eventcountry" value={formData.eventcountry} onChange={(e) => setFormData({ ...formData, eventcountry: e.target.value })} className="w-full p-2 border rounded" required />
				</div>
				<div>
					<label htmlFor="eventvenue" className="block mb-2 font-bold">
						Event Venue
					</label>
					<input id="eventvenue" value={formData.eventvenue} onChange={(e) => setFormData({ ...formData, eventvenue: e.target.value })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventdate" className="block mb-2 font-bold">
						Event Date
					</label>
					<input type="date" id="eventdate" value={formData.eventdate} onChange={(e) => setFormData({ ...formData, eventdate: e.target.value })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventtime" className="block mb-2 font-bold">
						Event Time
					</label>
					<input type="text" id="eventtime" value={formData.eventtime} onChange={(e) => setFormData({ ...formData, eventtime: e.target.value })} className="w-full p-2 border rounded" />
				</div>
				{/* <div>
					<label htmlFor="eventprice" className="block mb-2 font-bold">
						Event Price
					</label>
					<input type="text" id="eventprice" value={formData.eventprice} onChange={(e) => setFormData({ ...formData, eventprice: e.target.value })} className="w-full p-2 border rounded" />
				</div> */}
				<div>
					<label htmlFor="earlyBirdPrice" className="block mb-2 font-bold">
						Early Bird Price
					</label>
					<input type="text" id="earlyBirdPrice" value={formData.earlyBirdPrice} onChange={(e) => setFormData({ ...formData, earlyBirdPrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="vipPrice" className="block mb-2 font-bold">
						VIP Price
					</label>
					<input type="text" id="vipPrice" value={formData.vipPrice} onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="standardPrice" className="block mb-2 font-bold">
						Standard Price
					</label>
					<input type="text" id="standardPrice" value={formData.standardPrice} onChange={(e) => setFormData({ ...formData, standardPrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="frontRowPrice" className="block mb-2 font-bold">
						Front Row Price
					</label>
					<input type="text" id="frontRowPrice" value={formData.frontRowPrice} onChange={(e) => setFormData({ ...formData, frontRowPrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="backRowPrice" className="block mb-2 font-bold">
						Back Row Price
					</label>
					<input type="text" id="backRowPrice" value={formData.backRowPrice} onChange={(e) => setFormData({ ...formData, backRowPrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="preSalePrice" className="block mb-2 font-bold">
						Pre Sale Price
					</label>
					<input type="text" id="preSalePrice" value={formData.preSalePrice} onChange={(e) => setFormData({ ...formData, preSalePrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="doorSalePrice" className="block mb-2 font-bold">
						Door Sale Price
					</label>
					<input type="text" id="doorSalePrice" value={formData.doorSalePrice} onChange={(e) => setFormData({ ...formData, doorSalePrice: e.target.value })} className="w-full p-2 border rounded" />
				</div>

				<div>
					<label htmlFor="eventspotifyUrl" className="block mb-2 font-bold">
						Spotify Url
					</label>
					<input type="text" id="eventspotifyUrl" value={formData.eventspotifyUrl} onChange={(e) => setFormData({ ...formData, eventspotifyUrl: e.target.value })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventyoutubeUrl" className="block mb-2 font-bold">
						Youtube Url
					</label>
					<input type="text" id="eventyoutubeUrl" value={formData.eventyoutubeUrl} onChange={(e) => setFormData({ ...formData, eventyoutubeUrl: e.target.value })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventposter" className="block mb-2 font-bold">
						Event Main Poster
					</label>
					<input type="file" id="eventposter" onChange={(e) => setFormData({ ...formData, eventposter: e.target.files[0] })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventposter2" className="block mb-2 font-bold">
						Event Poster 2
					</label>
					<input type="file" id="eventposter2" onChange={(e) => setFormData({ ...formData, eventposter2: e.target.files[0] })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventposter3" className="block mb-2 font-bold">
						Event Poster 3
					</label>
					<input type="file" id="eventposter3" onChange={(e) => setFormData({ ...formData, eventposter3: e.target.files[0] })} className="w-full p-2 border rounded" />
				</div>
				<div>
					<label htmlFor="eventvideo" className="block mb-2 font-bold">
						Event Video
					</label>
					<input type="file" id="eventvideo" onChange={(e) => setFormData({ ...formData, eventvideo: e.target.files[0] })} className="w-full p-2 border rounded" />
				</div>
				<div className="grid grid-cols-2 gap-2">
					<button type="submit" disabled={submitting} className={`w-full p-1.5 rounded ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} text-slate-200 font-bold`}>
						{submitting ? `${eventToEdit ? "Updating" : "Creating"} Event...` : `${eventToEdit ? "Update" : "Create"} Event`}
					</button>
					<Button variant="outline" onClick={handleCloseEventModal}>
						Close
					</Button>
				</div>
			</form>
		</div>
	);
}

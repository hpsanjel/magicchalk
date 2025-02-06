"use client";

import React from "react";
import useFetchData from "@/hooks/useFetchData";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircleReply, Trash2 } from "lucide-react";

export default function QuotesPage() {
	const { data: quotes, error, loading, mutate } = useFetchData("/api/quotes", "quotes");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`/api/quotes/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete quote");
			}
			mutate();
		} catch (error) {
			console.error("Error deleting quote:", error);
			alert("Failed to delete quote. Please try again.");
		}
	};
	const handleReplyEmail = (email) => {
		const subject = encodeURIComponent("Re: Your quotation has been successfully received by KNS");
		const body = encodeURIComponent("Thank you for your quotation. We have received it well and we will get back to you shortly.");
		window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
	};

	return (
		<div className="">
			<div className=" bg-white rounded-lg shadow">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Quote For</TableHead>
							<TableHead>Quote Sender</TableHead>
							<TableHead>Contact Person</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Quote Info</TableHead>
							<TableHead>Offered Price</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{quotes?.length > 0 ? (
							quotes.map((quote) => (
								<TableRow key={quote._id}>
									<TableCell>{quote.eventType}</TableCell>
									<TableCell>{quote.companyName}</TableCell>
									<TableCell>{quote.contactName}</TableCell>
									<TableCell>{quote.address}</TableCell>
									<TableCell>{quote.email}</TableCell>
									<TableCell>{quote.phone}</TableCell>
									<TableCell>{quote.additionalInfo}</TableCell>
									<TableCell className="font-semibold">{quote.offeredPrice}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button variant="ghost" size="icon" onClick={() => handleDelete(quote._id)}>
												<Trash2 className="w-6 h-6 text-red-700" />
											</Button>
											<Button variant="ghost" size="icon" onClick={() => handleReplyEmail(quote.email)}>
												<MessageCircleReply className="w-6 h-6 text-blue-700" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={9} className="text-left text-red-600">
									No Quotes have been received yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

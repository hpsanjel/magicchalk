// pages/checkout.tsx (Checkout Page)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
	const [paymentDetails, setPaymentDetails] = useState({
		name: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
	});
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPaymentDetails({ ...paymentDetails, [name]: value });
	};

	const handleSubmitPayment = () => {
		// Simulate payment submission
		alert("Payment successful!");
		router.push("/confirmation");
	};

	return (
		<div className="w-full max-w-3xl mx-auto px-6 pt-48 pb-24 min-h-screen">
			<h1 className="text-xl font-bold mb-6">Checkout</h1>
			<div className="space-y-4">
				<div>
					<label className="block mb-2">Full Name</label>
					<input type="text" name="name" value={paymentDetails.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
				</div>
				<div>
					<label className="block mb-2">Card Number</label>
					<input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
				</div>
				<div className="flex space-x-4">
					<div>
						<label className="block mb-2">Expiry Date</label>
						<input type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
					</div>
					<div>
						<label className="block mb-2">CVV</label>
						<input type="text" name="cvv" value={paymentDetails.cvv} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
					</div>
				</div>
				<Button className="bg-blue-500 text-white" onClick={handleSubmitPayment}>
					Submit Payment
				</Button>
			</div>
		</div>
	);
}

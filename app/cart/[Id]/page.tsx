// pages/cart/[eventId].tsx (Cart Page)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

interface CartItem {
	id: string;
	title: string;
	price: string;
	quantity: number;
}

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const params = useParams();
	const router = useRouter();

	const { Id } = params;

	useEffect(() => {
		// Fetch cart data (for simplicity, using mock data here)
		const event = { id: Id as string, title: "Concert A", price: "50" };
		setCartItems([{ ...event, quantity: 1 }]);
		setTotalPrice(parseFloat(event.price));
	}, [Id]);

	const updateQuantity = (id: string, quantity: number) => {
		setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
	};

	const removeItem = (id: string) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const handleProceedToCheckout = () => {
		router.push("/checkout");
	};

	return (
		<div className="w-full max-w-3xl mx-auto px-6 pt-48 pb-24 min-h-screen">
			<h1 className="text-xl font-bold mb-6">Your Cart</h1>
			<div className="space-y-4">
				{cartItems.length === 0 ? (
					<p>Your cart is empty. Please add tickets to the cart.</p>
				) : (
					cartItems.map((item) => (
						<div key={item.id} className="flex items-center justify-between space-x-4 border-b py-4">
							<div className="flex-1">
								<p className="font-medium">{item.title}</p>
								<p className="text-sm text-gray-500">Price: ${item.price}</p>
							</div>
							<div className="flex items-center space-x-2">
								<input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 p-1 border border-gray-300 rounded" min="1" />
								<Button size="sm" variant="outline" className="text-red-500" onClick={() => removeItem(item.id)}>
									Remove
								</Button>
							</div>
						</div>
					))
				)}
				<div className="flex justify-between items-center pt-4">
					<p className="text-lg font-bold">Total: ${totalPrice}</p>
					<Button className="bg-blue-500 text-white" onClick={handleProceedToCheckout}>
						Proceed to Checkout
					</Button>
				</div>
			</div>
		</div>
	);
}

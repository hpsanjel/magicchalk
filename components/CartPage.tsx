"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface CartItem {
	id: string;
	title: string;
	price: string;
	quantity: number;
}

export default function CartPage() {
	// Example cart items
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{ id: "1", title: "Event Ticket - Regular", price: "50", quantity: 1 },
		{ id: "2", title: "Event Ticket - VIP", price: "100", quantity: 1 },
	]);

	// Update quantity of items
	const updateQuantity = (id: string, quantity: number) => {
		setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
	};

	// Remove item from cart
	const removeItem = (id: string) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	// Calculate total price
	const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

	return (
		<div className="w-full max-w-3xl mx-auto px-6 pt-48 pb-24 min-h-screen">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-bold">Event Booking Cart</CardTitle>
					<CardDescription className="text-sm">Review and edit your event ticket selections</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{cartItems.length === 0 ? (
						<p>Your cart is empty. Please add some tickets!</p>
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
										<Trash className="w-4 h-4" />
										<span className="sr-only">Remove Item</span>
									</Button>
								</div>
							</div>
						))
					)}
					{cartItems.length > 0 && (
						<div className="flex justify-between items-center pt-4">
							<p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
							<Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => alert("Proceed to checkout!")}>
								Proceed to Checkout
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

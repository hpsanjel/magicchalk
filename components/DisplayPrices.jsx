"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const DisplayPrices = ({ prices }) => {
	const [cart, setCart] = useState({});

	// Filter out items with non-zero prices
	const filteredPrices = prices.filter((item) => {
		return Object.entries(item).some(([key, value]) => key.toLowerCase().includes("price") && value && value !== "0");
	});

	const addToCart = (type, price, quantity) => {
		setCart((prevCart) => ({
			...prevCart,
			[type]: (prevCart[type] || 0) + quantity,
		}));
	};

	return (
		<Card className="w-full max-w-sm mx-auto shadow-lg">
			<div className="p-4">
				<h2 className="text-lg font-semibold text-center mb-4">Ticket Prices</h2>

				{filteredPrices.length > 0 ? (
					<div className="space-y-2">
						{filteredPrices.map((item, index) => (
							<div key={index}>
								{Object.entries(item).map(([key, value]) => {
									if (key.toLowerCase().includes("price") && value && value !== "0") {
										const type = key.replace("Price", "");
										return <PriceRow key={key} type={type} price={value} badge={getBadge(type)} onAddToCart={(quantity) => addToCart(type, value, quantity)} />;
									}
									return null;
								})}
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-sm text-muted-foreground">No prices set for this event</p>
				)}

				{Object.keys(cart).length > 0 && (
					<div className="mt-4 pt-4 border-t border-border">
						<h3 className="text-sm font-semibold mb-2">Your Cart</h3>
						{Object.entries(cart).map(([type, quantity]) => (
							<div key={type} className="flex justify-between text-sm">
								<span>{type}</span>
								<span>
									{quantity} ticket{quantity > 1 ? "s" : ""}
								</span>
							</div>
						))}
						<Button className="w-full mt-4" variant="default">
							<ShoppingCart className="w-4 h-4 mr-2" />
							Checkout
						</Button>
					</div>
				)}
			</div>
		</Card>
	);
};

const PriceRow = ({ type, price, badge, onAddToCart }) => {
	const [quantity, setQuantity] = useState(0);

	const incrementQuantity = () => setQuantity((prev) => prev + 1);
	const decrementQuantity = () => setQuantity((prev) => Math.max(0, prev - 1));

	return (
		<div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">{type}</span>
					{badge && (
						<Badge variant="secondary" className="text-xs">
							{badge}
						</Badge>
					)}
				</div>
				<span className="text-base font-semibold text-primary">${price}</span>
			</div>
			<div className="flex items-center space-x-2">
				<Button size="icon" variant="outline" onClick={decrementQuantity}>
					<Minus className="h-4 w-4" />
				</Button>
				<Input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, Number.parseInt(e.target.value) || 0))} className="w-14 text-center" />
				<Button size="icon" variant="outline" onClick={incrementQuantity}>
					<Plus className="h-4 w-4" />
				</Button>
				<Button
					size="sm"
					onClick={() => {
						if (quantity > 0) {
							onAddToCart(quantity);
							setQuantity(0);
						}
					}}
					disabled={quantity === 0}
				>
					Add
				</Button>
			</div>
		</div>
	);
};

const getBadge = (type) => {
	switch (type.toLowerCase()) {
		case "earlybird":
			return "Limited";
		case "vip":
			return "Premium";
		case "frontrow":
			return "Best View";
		case "presale":
			return "Early Access";
		default:
			return null;
	}
};

export default DisplayPrices;

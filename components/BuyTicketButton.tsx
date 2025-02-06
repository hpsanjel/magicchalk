"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

export function BuyTicketButton({ btnText, btnState, eventName }: { btnText: string; btnState: boolean; eventName: string }) {
	const router = useRouter();

	const handleBookNow = (id: string) => {
		router.push(`/cart/${id}`);
	};

	return (
		<Button size="lg" disabled={btnState} onClick={() => handleBookNow(eventName)} className={` ${btnText === "Get Your Tickets Now" ? "w-full" : "bg-red-700 flex items-center justify-center"}`}>
			{btnText === "Get Your Tickets Now" ? <Ticket className="hidden md:block h-4 w-4" /> : <ShoppingCart className="hidden md:block h-4 w-4" />}
			<span className="ml-2">{btnText}</span>
		</Button>
	);
}

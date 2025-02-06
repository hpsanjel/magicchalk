"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ActiveMenuProvider } from "@/context/ActiveMenuContext";
import GoToTopButton from "@/components/GoToTopBottom";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { ProfileProvider } from "@/context/ProfileContext";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};
	return (
		<html lang="en">
			<AuthProvider>
				<ProfileProvider>
					<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
						<Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

						<ActiveMenuProvider>{children}</ActiveMenuProvider>
						<GoToTopButton />
						<Toaster position="bottom-right" reverseOrder={false} />
						<Footer />
					</body>
				</ProfileProvider>
			</AuthProvider>
		</html>
	);
}

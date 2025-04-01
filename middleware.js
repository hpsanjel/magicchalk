import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function middleware(req) {
	const tokenObj = req.cookies.get("authToken");
	const token = tokenObj?.value;

	if (!token || typeof token !== "string") {
		console.error("Token is missing or invalid");
		return NextResponse.redirect(new URL("/user", req.url));
	}

	// Check if the JWT secret is available
	if (!JWT_SECRET) {
		console.error("JWT_SECRET_KEY is not set in environment");
		return NextResponse.redirect(new URL("/user", req.url));
	}

	try {
		// Verify the token
		const secretKey = new TextEncoder().encode(JWT_SECRET);
		const { payload } = await jwtVerify(token, secretKey);

		// Optionally, pass user info downstream
		const response = NextResponse.next();
		response.headers.set("x-user", JSON.stringify(payload));
		return response;
	} catch (error) {
		console.error("JWT verification failed:", error.message);
		return NextResponse.redirect(new URL("/user", req.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*"],
};

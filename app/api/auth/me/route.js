import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function GET(req) {
	try {
		const tokenObj = req.cookies.get("authToken");
		const token = tokenObj?.value;

		if (!token) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		const secretKey = new TextEncoder().encode(JWT_SECRET);
		const { payload } = await jwtVerify(token, secretKey);

		return NextResponse.json({
			user: {
				email: payload.email,
				id: payload.id,
			},
		});
	} catch (error) {
		console.error("Failed to verify token:", error);
		return NextResponse.json({ user: null }, { status: 401 });
	}
}

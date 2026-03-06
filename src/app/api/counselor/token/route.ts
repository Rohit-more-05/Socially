import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { SignJWT } from "jose";
export async function POST(req: NextRequest) {
    try {
        // 1. Verify Clerk authentication
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        // 2. Parse request body
        const body = await req.json();
        const { clerkUserId, email, fullName, username } = body;
        // 3. Validate required data
        if (!clerkUserId || !email || !fullName || !username) {
            return NextResponse.json(
                { error: "Missing required user data" },
                { status: 400 }
            );
        }
        // 4. Verify user ID matches (prevent impersonation)
        if (user.id !== clerkUserId) {
            return NextResponse.json(
                { error: "User ID mismatch" },
                { status: 403 }
            );
        }
        // 5. Get bridge secret
        const secret = process.env.BRIDGE_TOKEN_SECRET;
        if (!secret) {
            console.error("BRIDGE_TOKEN_SECRET not configured");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }
        // 6. Generate JWT with jose
        const encodedSecret = new TextEncoder().encode(secret);

        const token = await new SignJWT({
            clerkId: clerkUserId,
            email: email,
            fullName: fullName,
            username: username,
            source: "nexly",
            timestamp: Date.now(),
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("5m") // 5 minutes
            .sign(encodedSecret);
        console.log("TOKEN_GENERATED", { email, length: token.length });
        return NextResponse.json({ token });

    } catch (error: any) {
        console.error("TOKEN_GENERATION_ERROR", error);
        return NextResponse.json(
            { error: "Failed to generate token", details: error.message },
            { status: 500 }
        );
    }
}
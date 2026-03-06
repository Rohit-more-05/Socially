import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDbUserId } from "@/actions/user.action";
import { SignJWT } from "jose";

export default async function CounselorPage() {
    let redirectUrl: string | null = null;
    let error: any = null;
    const startTime = Date.now();

    try {
        console.log(`[${startTime}] COUNSELOR_PAGE_START: Starting authentication flow`);

        // 1. Verify Clerk authentication
        const user = await currentUser();

        if (!user) {
            console.log(`[${Date.now()}] COUNSELOR_PAGE: User not authenticated, redirecting to sign-in`);
            redirect("/sign-in");
        }
        console.log(`[${Date.now()}] COUNSELOR_PAGE: Clerk user authenticated`, { id: user.id });

        // 2. Get NexLy database user ID
        console.log(`[${Date.now()}] COUNSELOR_PAGE: Fetching DB User ID`);
        const dbUserId = await getDbUserId();
        console.log(`[${Date.now()}] COUNSELOR_PAGE: DB User ID fetched`, { dbUserId });

        // 3. Get user data
        const email = user.emailAddresses[0]?.emailAddress;
        const fullName = user.fullName || user.username || "Student";
        const username = user.username || email?.split("@")[0] || "student";

        if (!email) {
            console.error(`[${Date.now()}] COUNSELOR_PAGE_ERROR: Email missing`);
            throw new Error("User email not found");
        }

        // 4. Generate JWT bridge token directly
        const secret = process.env.BRIDGE_TOKEN_SECRET;

        if (!secret) {
            console.error(`[${Date.now()}] COUNSELOR_PAGE_ERROR: BRIDGE_TOKEN_SECRET missing`);
            throw new Error("Server configuration error - bridge secret missing");
        }

        console.log(`[${Date.now()}] COUNSELOR_PAGE: Generating JWT token`);
        const encodedSecret = new TextEncoder().encode(secret);

        const token = await new SignJWT({
            clerkId: user.id,
            email: email,
            fullName: fullName,
            username: username,
            source: "nexly",
            timestamp: Date.now() - 60000, // Backdate 1min to prevent "iat future" clock skew
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("5m") // 5 minutes
            .sign(encodedSecret);

        console.log(`[${Date.now()}] COUNSELOR_PAGE_SUCCESS: Token generated`, { length: token.length });

        // 5. Set redirect URL
        const ybtUrl = process.env.NEXT_PUBLIC_YBT_CHAT_URL || "http://localhost:5173";
        redirectUrl = `${ybtUrl}/auth?token=${token}`;
        console.log(`[${Date.now()}] COUNSELOR_PAGE: Ready to redirect to`, redirectUrl);

    } catch (err: any) {
        // NEXT_REDIRECT is actually an error thrown by Next.js to handle redirects
        // We need to re-throw it if it was caught
        if (err.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }

        console.error(`[${Date.now()}] COUNSELOR_PAGE_ERROR: Exception caught`, err);
        error = err;
    }

    // Perform redirect outside of try-catch block
    if (redirectUrl) {
        console.log(`[${Date.now()}] COUNSELOR_PAGE: Executing redirect now...`);
        redirect(redirectUrl);
    }

    // If we're here, it means we have an error and no redirect
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-red-900 mb-4">
                    Authentication Error
                </h1>
                <p className="text-red-700 mb-4">
                    Failed to generate authentication token for YBT Chat.
                </p>
                <div className="bg-red-100 p-3 rounded text-sm font-mono text-red-800 mb-6 overflow-auto max-h-32">
                    {error?.message || "Unknown error occurred"}
                    {error?.stack && <div className="mt-2 text-xs opacity-75">{error.stack.split('\n')[0]}</div>}
                </div>
                <a
                    href="/"
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Return to Home
                </a>
            </div>
        </div>
    );
}

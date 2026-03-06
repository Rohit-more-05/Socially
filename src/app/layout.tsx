import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, SignedIn, SignIn, useAuth } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";
import VioletStormBackground from "@/components/ui/bg";
import ChatbotButton from "@/components/ChatBot";

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

export const metadata: Metadata = {
  title: "AnchorSpace",
  description: "A modern social media application powered by Next.js",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              <Navbar />
              <VioletStormBackground>

                <main className="py-8">
                  {/* container to center the content */}
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="hidden lg:block lg:col-span-3">
                        <Sidebar />
                      </div>
                      <div className="lg:col-span-9">{children}
                        <SignedIn>
                          <ChatbotButton />
                        </SignedIn>
                      </div>
                    </div>
                  </div>
                </main>
              </VioletStormBackground>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useAuth, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import { hasUnreadNotifications } from "@/actions/notification.action";
import { cn } from "@/lib/utils";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(false)
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const { user } = useUser()


  const profileUrl = user ? `/profile/${user.username ?? user.emailAddresses?.[0]?.emailAddress.split("@")[0]
    }` : "/profile";

  useEffect(() => {
    async function fetchUnread() {
      try {
        const result = await hasUnreadNotifications();
        setHasUnread(!!result);
      } catch (error) {
        console.error("Failed to check unread notifications", error);
      }
    }

    if (isSignedIn) {
      fetchUnread();
    }
  }, [isSignedIn]);


  return (
    <div className="flex md:hidden items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        {hasUnread && (
          <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        )}
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button variant="ghost" className="flex items-center gap-3 justify-start relative" asChild>
                  <Link href="/notifications" className="flex items-center gap-2">
                    <BellIcon className="w-4 h-4" />
                    <span>Notifications</span>
                    {hasUnread && (
                      <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="flex items-center gap-3 justify-start">
                  <Link href="/search" className="flex items-center gap-2">
                    <SearchIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                    <span className="text-sm transition-colors duration-300">Search </span>
                  </Link>
                </Button>


                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link
                    href={`/profile/${user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]
                      }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button variant="ghost" className="flex items-center gap-3 justify-start w-full">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
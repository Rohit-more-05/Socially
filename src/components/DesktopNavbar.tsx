"use client";

import { BellIcon, HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DesktopNavbar() {
  const { user } = useUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Select defaultValue="student">
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="councellor">Councellor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild className="relative group flex items-center gap-2">
        <Link href="/search" className="flex items-center gap-2">
          <SearchIcon
            className={cn(
              "w-4 h-4 transition-colors duration-300",
            )}
          />
          <span className="hidden lg:flex items-center gap-1 transition-colors duration-300 ">
            Search
          </span>
        </Link>
      </Button>

      <SignedIn>
        <Button variant="ghost" asChild className="relative group flex items-center gap-2">
          <Link href="/notifications" className="flex items-center gap-2">
            <BellIcon
              className={cn(
                "w-4 h-4 transition-colors duration-300",
              )}
            />
            <span className="hidden lg:flex items-center gap-1 transition-colors duration-300 ">
              Notifications
            </span>
          </Link>
        </Button>

        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link
            href={`/profile/${user?.username ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? ""
              }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </Button>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
export default DesktopNavbar;
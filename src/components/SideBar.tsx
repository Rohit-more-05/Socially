"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserByClerkId } from "@/actions/user.action";

interface DbUser {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

function Sidebar() {
  return (
    <div className="sticky top-20">
      <SignedIn>
        <AuthenticatedSidebar />
      </SignedIn>
      <SignedOut>
        <UnAuthenticatedSidebar />
      </SignedOut>
    </div>
  );
}

function AuthenticatedSidebar() {
  const { user: clerkUser, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!clerkUser?.id) return;
      try {
        const user = await getUserByClerkId(clerkUser.id);
        setDbUser(user as DbUser | null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded && clerkUser) {
      fetchUser();
    }
  }, [clerkUser, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dbUser) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href={`/profile/${dbUser.username}`}
            className="flex flex-col items-center justify-center"
          >
            <Avatar className="w-20 h-20 border-2 ">
              <AvatarImage src={dbUser.image || "/avatar.png"} />
            </Avatar>

            <div className="mt-4 space-y-1">
              <h3 className="font-semibold">{dbUser.name}</h3>
              <p className="text-sm text-muted-foreground">{dbUser.username}</p>
            </div>
          </Link>

          {dbUser.bio && <p className="mt-3 text-sm text-muted-foreground">{dbUser.bio}</p>}

          <div className="w-full">
            <Separator className="my-4" />
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{dbUser._count.following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-medium">{dbUser._count.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {dbUser.location || "No location"}
            </div>
            <div className="flex items-center text-muted-foreground">
              <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
              {dbUser.website ? (
                <a href={`${dbUser.website}`} className="hover:underline truncate" target="_blank">
                  {dbUser.website}
                </a>
              ) : (
                "No website"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const UnAuthenticatedSidebar = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-center text-muted-foreground mb-4">
        Login to access your profile and connect with others.
      </p>
      <SignInButton mode="modal">
        <Button className="w-full" variant="outline">
          Login
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="w-full mt-2" variant="default">
          Sign Up
        </Button>
      </SignUpButton>
    </CardContent>
  </Card>
);

export default Sidebar;
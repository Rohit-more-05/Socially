"use client";

import { useState, useEffect } from "react";
import { searchUsers, toggleFollow } from "@/actions/user.action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof searchUsers>>[0];



export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);



    useEffect(() => {
        const handleSearch = async () => {
            if (!debouncedQuery.trim()) {
                setUsers([]);
                return;
            }

            setLoading(true);
            try {
                const results = await searchUsers(debouncedQuery);
                setUsers(results);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        handleSearch();
    }, [debouncedQuery]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Search Users</h1>
                <p className="text-muted-foreground">
                    Find and connect with other users on AnchorSpace
                </p>
            </div>

            {/* Search Input */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                            placeholder="Search for users by name or username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Search Results */}
            {loading ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-2">Searching...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : query && users.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex gap-2 items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${user.username}`}>
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={user.image ?? "/avatar.png"} />
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1">
                                            <Link
                                                href={`/profile/${user.username}`}
                                                className="font-medium cursor-pointer hover:underline"
                                            >
                                                {user.name || user.username}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : query && users.length === 0 && !loading ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium">No users found</h3>
                            <p className="text-muted-foreground">
                                Try searching with a different name or username
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium">Start searching</h3>
                            <p className="text-muted-foreground">
                                Enter a name or username to find users
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
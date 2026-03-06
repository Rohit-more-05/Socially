// src/components/CreatePost.tsx
"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { ImageIcon, Loader2Icon, SendIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "./ui/button"
import toast from "react-hot-toast"
import { createPost } from "@/actions/post.action"
import ImageUpload from "./ImageUpload"

function CreatePost() {
    const { user } = useUser()
    const [content, setContent] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [isPosting, setIsPosting] = useState(false)
    const [showImageUpload, setShowImageUpload] = useState(false)

    if (!user) return null;

    const handleSubmit = async () => {
        if (!content.trim() && !imageUrl) return;

        setIsPosting(true);
        try {
            const result = await createPost(content, imageUrl);

            console.log("Post result:", result); // Debug log

            if (result?.success) {
                // reset the form
                setContent("");
                setImageUrl("");
                setShowImageUpload(false);

                toast.success("Post created successfully! 🎉");
            } else {
                // Show moderation error or any other error
                const errorMessage = result?.error || "Failed to create post";
                toast.error(errorMessage, {
                    duration: 5000,
                    style: {
                        background: '#FEE2E2',
                        color: '#991B1B',
                        border: '1px solid #FCA5A5',
                    },
                });
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Positive community message */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                        <ShieldCheckIcon className="size-4 text-green-600" />
                        <span>Share positivity! This is a safe space for uplifting content.</span>
                    </div>

                    <div className="flex space-x-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                        </Avatar>
                        <Textarea
                            placeholder="Share something positive and uplifting..."
                            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isPosting}
                        />
                    </div>

                    {(showImageUpload || imageUrl) && (
                        <div className="border rounded-lg p-4">
                            <ImageUpload
                                endpoint="postImage"
                                value={imageUrl}
                                onChange={(url) => {
                                    setImageUrl(url);
                                    if (!url) setShowImageUpload(false);
                                }}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={() => setShowImageUpload(!showImageUpload)}
                                disabled={isPosting}
                            >
                                <ImageIcon className="size-4 mr-2" />
                                Photo
                            </Button>
                        </div>
                        <Button
                            className="flex items-center"
                            onClick={handleSubmit}
                            disabled={(!content.trim() && !imageUrl) || isPosting}
                        >
                            {isPosting ? (
                                <>
                                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <SendIcon className="size-4 mr-2" />
                                    Post
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default CreatePost;
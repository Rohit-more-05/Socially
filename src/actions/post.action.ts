// src/actions/post.action.ts
"use server"
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import { moderateContent } from "./modertaion.action";

export async function createPost(content: string, image: string) {
    try {
        const userId = await getDbUserId()
        if (!userId) {
            return { success: false, error: "You must be logged in to post" };
        }

        // Moderate content before creating post
        if (content) {
            const moderation = moderateContent(content);
            if (!moderation.isValid) {
                console.log("Content moderation failed:", moderation); // Debug log
                return {
                    success: false,
                    error: moderation.message || "Your content contains words that don't align with our positive community values.",
                    prohibitedWords: moderation.prohibitedWords
                };
            }
        }

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId
            }
        })
        revalidatePath("/")
        return { success: true, post }
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" };
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");
        if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");

        await prisma.post.delete({
            where: { id: postId },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}

export async function getPosts() {
    try {
        // If the database is not configured (e.g. during local development without .env),
        // avoid invoking Prisma which will throw a noisy initialization error.
        if (!process.env.DATABASE_URL) {
            console.warn("DATABASE_URL not set - returning empty posts list");
            return [];
        }
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        username: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                image: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        return posts;
    } catch (error) {
        console.log("Error in getPosts", error);
        // Return an empty array when posts cannot be fetched (e.g. DB not configured)
        // This avoids throwing and causing a 500 response during development.
        return [];
    }
}

export async function toggleLike(postId: string) {
    try {
        const userId = await getDbUserId();
        if (!userId) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId,
                    },
                }),
                ...(post.authorId !== userId
                    ? [
                        prisma.notification.create({
                            data: {
                                type: "LIKE",
                                userId: post.authorId,
                                creatorId: userId,
                                postId,
                            },
                        }),
                    ]
                    : []),
            ]);
        }

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle like:", error);
        return { success: false, error: "Failed to toggle like" };
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;
        if (!content) throw new Error("Content is required");

        // Moderate comment content before creating
        const moderation = moderateContent(content);
        if (!moderation.isValid) {
            return {
                success: false,
                error: moderation.message,
                prohibitedWords: moderation.prohibitedWords
            };
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");

        const [comment] = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId,
                },
            });

            if (post.authorId !== userId) {
                await tx.notification.create({
                    data: {
                        type: "COMMENT",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id,
                    },
                });
            }

            return [newComment];
        });

        revalidatePath(`/`);
        return { success: true, comment };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { success: false, error: "Failed to create comment" };
    }
}
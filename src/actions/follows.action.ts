import prisma from "@/lib/prisma";


export async function getUserFollowers(userId: string) {
    try {
      const followers = await prisma.follows.findMany({
        where: {
          followingId: userId, // Users who are following this user
        },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return followers.map((follow) => follow.follower);
    } catch (error) {
      console.error("Error fetching user followers:", error);
      throw new Error("Failed to fetch user followers");
    }
  }
  
  export async function getUserFollowing(userId: string) {
    try {
      const following = await prisma.follows.findMany({
        where: {
          followerId: userId, // Users that this user is following
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return following.map((follow) => follow.following);
    } catch (error) {
      console.error("Error fetching user following:", error);
      throw new Error("Failed to fetch user following");
    }
  }
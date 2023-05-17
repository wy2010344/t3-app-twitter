import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({
    id: z.string()
  })).query(async ({ input: { id }, ctx }) => {
    const currentUserId = ctx.session?.user.id
    const profile = await ctx.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        name: true,
        image: true,
        _count: {
          select: {
            followers: true,
            follows: true,
            tweets: true
          }
        },
        followers: currentUserId ? {
          where: {
            id: currentUserId
          }
        } : undefined
      }
    })
    if (profile) {
      return {
        id,
        name: profile.name,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        tweetsCount: profile._count.tweets,
        isFollowing: profile.followers.length > 0
      }
    }
  }),
  toggleFollow: protectedProcedure.input(z.object({
    userId: z.string()
  })).mutation(async ({
    input: {
      userId
    },
    ctx
  }) => {
    const currentUserId = ctx.session.user.id

    const existingFollow = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
        followers: {
          some: {
            id: currentUserId
          }
        }
      }
    })

    if (existingFollow) {
      await ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          followers: {
            disconnect: {
              id: currentUserId
            }
          }
        }
      })
    } else {
      await ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          followers: {
            connect: {
              id: currentUserId
            }
          }
        }
      })
    }
    ctx.revalidateSSG?.(`/profile/${userId}`)
    ctx.revalidateSSG?.(`/profile/${currentUserId}`)
    return {
      addedFollow: !existingFollow
    }
  })
});

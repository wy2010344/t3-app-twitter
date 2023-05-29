'use server'
import getCurrentUser from "@/app/actions/getCurrentUser";
import { zact } from "zact/server";
import { z } from 'zod'
import prisma from "@/app/libs/Prismadb";
import { headers } from "next/dist/client/components/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/Pusher";
const getConversation = zact(z.object({
  userId: z.string().trim().nonempty(),
}))(async function ({
  userId,
}) {
  const currentUser = await getCurrentUser()
  if (!(currentUser?.id || currentUser?.email)) {
    throw new Error('Unauthorized')
  }
  const existingConversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          userIds: {
            equals: [currentUser.id, userId]
          }
        },
        {
          userIds: {
            equals: [userId, currentUser.id]
          }
        }
      ]
    }
  })
  const existingConversation = existingConversations[0]
  if (existingConversation) {
    return existingConversation
  }

  const newConversation = await prisma.conversation.create({
    data: {
      users: {
        connect: [
          {
            id: currentUser.id
          },
          {
            id: userId
          }
        ]
      }
    },
    include: {
      users: true
    }
  })

  newConversation.users.forEach(user => {
    if (user.email) {
      pusherServer.trigger(user.email, 'conversation:new', newConversation)
    }
  })
  return newConversation
})

export default getConversation
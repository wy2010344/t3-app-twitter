"use server"

import getCurrentUser from "@/app/actions/getCurrentUser"
import { zact } from "zact/server"
import { z } from 'zod'
import prisma from "@/app/libs/Prismadb"
import { pusherServer } from "@/app/libs/Pusher"
const deleteConversation = zact(z.object({
  conversationId: z.string().trim().nonempty()
}))(async function ({ conversationId }) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) {
    throw new Error('Unauthorized')
  }

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      users: true
    }
  })
  if (!existingConversation) {
    throw new Error('Invalid ID')
  }

  const deletedConversation = await prisma.conversation.deleteMany({
    where: {
      id: conversationId,
      userIds: {
        hasSome: [
          currentUser.id
        ]
      }
    }
  })

  existingConversation.users.forEach(user => {
    if (user.email) {
      pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
    }
  })

  return deletedConversation
})

export default deleteConversation
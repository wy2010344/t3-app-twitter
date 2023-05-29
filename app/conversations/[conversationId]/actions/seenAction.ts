'use server'
import { z } from 'zod'
import { zact } from "zact/server"
import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/Prismadb'
import { pusherServer } from '@/app/libs/Pusher'
const seenAction = zact(z.object({
  conversationId: z.string().trim().nonempty()
}))(async function ({
  conversationId
}) {
  const currentUser = await getCurrentUser()
  if (!(currentUser?.id && currentUser?.email)) {
    throw new Error('Unauthorized')
  }
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: {
        include: {
          seen: true
        }
      },
      users: true
    }
  })
  if (!conversation) {
    throw new Error('Invalid ID')
  }

  const lastMessage = conversation.messages.at(-1)
  if (!lastMessage) {
    return conversation
  }
  const updateMessage = await prisma.message.update({
    where: {
      id: lastMessage.id
    },
    include: {
      sender: true,
      seen: true
    },
    data: {
      seen: {
        connect: {
          id: currentUser.id
        }
      }
    }
  })

  await pusherServer.trigger(currentUser.email, 'conversation:update', {
    id: conversationId,
    messages: [updateMessage]
  })

  if (!lastMessage.seenIds.includes(currentUser.id)) {
    return conversation
  }

  await pusherServer.trigger(conversationId!, 'message:update', updateMessage)
  return updateMessage

})
export default seenAction
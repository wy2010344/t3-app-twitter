'use server'
import { z } from 'zod'
import { zact } from "zact/server";
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/Prismadb';
import { pusherServer } from '@/app/libs/Pusher';


export type SendMessage = AsyncReturnType<typeof sendMessageAction>


const sendMessageAction = zact(
  z.object({
    conversationId: z.string().trim().nonempty(),
    message: z.string().trim(),
    image: z.string().trim(),
  })
)(async function ({
  conversationId,
  message,
  image
}) {
  if (!(message || image)) {
    throw new Error('need meesage or image')
  }
  const currentUser = await getCurrentUser()
  if (!(currentUser?.id && currentUser?.email)) {
    throw new Error('Unauthorized')
  }

  const newMessage = await prisma.message.create({
    data: {
      body: message,
      image,
      conversation: {
        connect: {
          id: conversationId
        }
      },
      sender: {
        connect: {
          id: currentUser.id
        }
      },
      seen: {
        connect: {
          id: currentUser.id
        }
      }
    },
    include: {
      seen: true,
      sender: true
    }
  })
  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      lastMessageAt: new Date(),
      messages: {
        connect: {
          id: newMessage.id
        }
      }
    },
    include: {
      users: true,
      messages: {
        include: {
          seen: true
        }
      }
    }
  })

  await pusherServer.trigger(conversationId, 'messages:new', newMessage)

  const lastMessage = updatedConversation.messages.at(-1)

  updatedConversation.users.map(user => {
    pusherServer.trigger(user.email!, 'conversation:update', {
      id: conversationId,
      messages: [lastMessage]
    })
  })
  return newMessage
})


export default sendMessageAction
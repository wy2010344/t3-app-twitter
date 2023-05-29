'use server'
import { zact } from "zact/server";
import { z } from 'zod'
import getCurrentUser from "@/app/actions/getCurrentUser";

import prisma from "@/app/libs/Prismadb";
import { pusherServer } from "@/app/libs/Pusher";
const createConversation = zact(z.object({
  name: z.string().trim().nonempty(),
  members: z.array(z.object({
    value: z.string().trim().nonempty()
  })
  ).min(2)
}))(async function ({
  name, members
}) {
  const currentUser = await getCurrentUser()
  if (!(currentUser && (currentUser.id || currentUser.email))) {
    throw new Error('Unauthorized')
  }
  const newConversation = await prisma.conversation.create({
    data: {
      name,
      isGroup: true,
      users: {
        connect: [
          ...members.map(m => {
            return { id: m.value }
          }),
          {
            id: currentUser.id
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

export default createConversation
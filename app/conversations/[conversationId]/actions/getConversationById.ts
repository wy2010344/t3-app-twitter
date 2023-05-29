import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/Prismadb";


export type ConversationById = NotNull<AsyncReturnType<typeof getConversationById>>

export default async function getConversationById(conversationId: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.email) {
      return null
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })
    return conversation
  } catch (err) {
    console.error(err)
    return null
  }
}
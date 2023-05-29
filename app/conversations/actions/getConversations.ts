import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/Prismadb";

export type Conversation = AsyncReturnType<typeof getConversations>[number]
export default async function getConversations() {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) {
    return []
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })
    return conversations
  } catch (err) {
    console.error(err)
    return []
  }
}
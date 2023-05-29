import prisma from "@/app/libs/Prismadb"

export type Message = OrArrayMember<AsyncReturnType<typeof getMessages>>
export default async function getMessages(
  conversationId: string
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return messages
  } catch (err) {
    console.error(err)
  }
}
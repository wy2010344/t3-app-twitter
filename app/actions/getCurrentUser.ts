import getSession from "./getSession";
import prisma from "../libs/Prismadb";
export default async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    return currentUser || null
  } catch (err) {
    console.error(err)
    return null
  }
}
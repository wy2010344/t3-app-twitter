"use server"
import { z } from 'zod'
import { zact } from "zact/server"
import getCurrentUser from './getCurrentUser'
import prisma from '../libs/Prismadb'
const settingsAction = zact(z.object({
  name: z.string().trim().nonempty(),
  image: z.string().optional()
}))(async function ({
  name, image
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) {
    throw new Error('Unauthorized')
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      image,
      name
    }
  })
  return updatedUser
})

export default settingsAction
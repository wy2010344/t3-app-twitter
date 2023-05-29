'use server'
import { z } from 'zod'
import { zact } from 'zact/server'
import prisma from '@/app/libs/Prismadb'
import bcrypt from 'bcrypt'
const registerAction = zact(z.object({
  email: z.string().trim().nonempty().email(),
  name: z.string().trim().nonempty(),
  password: z.string().trim().nonempty()
}))(async function ({
  email, name, password
}) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword: await bcrypt.hash(password, 12)
    }
  })
  return user
})
export default registerAction
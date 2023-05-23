import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";




export const todoRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todoTask.findMany({
      orderBy: {
        createdAt: "asc"
      }
    })
  }),
  add: publicProcedure.input(z.object({
    id: z.string().optional(),
    text: z.string().trim().min(1)
  })).mutation(async ({ ctx, input }) => {
    const todo = await ctx.prisma.todoTask.create({
      data: input
    })
    return todo
  }),
  edit: publicProcedure.input(z.object({
    id: z.string().uuid(),
    data: z.object({
      completed: z.boolean().optional(),
      text: z.string().trim().min(1).optional()
    })
  })).mutation(async ({ ctx, input: {
    id, data
  } }) => {
    const todo = await ctx.prisma.todoTask.update({
      where: { id },
      data
    })
    return todo
  }),
  toggleAll: publicProcedure.input(z.object({
    completed: z.boolean()
  })).mutation(async ({ ctx, input: { completed } }) => {
    await ctx.prisma.todoTask.updateMany({
      data: {
        completed
      }
    })
  }),
  delete: publicProcedure.input(z.string().uuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.prisma.todoTask.delete({
        where: {
          id
        }
      })
      return id
    }),
  clearCompleted: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.todoTask.deleteMany({
      where: {
        completed: true
      }
    })
    return ctx.prisma.todoTask.findMany()
  })
})
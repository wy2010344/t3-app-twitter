import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { tweetRouter } from "~/server/api/routers/tweet";
import { profileRouter } from "./routers/profile";
import { todoRouter } from "./routers/todo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweet: tweetRouter,
  profile: profileRouter,
  todo: todoRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

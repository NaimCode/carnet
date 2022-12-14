import { router } from "../trpc";
import { adminRouter } from "./admin";
import { auctionnaireRouter } from "./auctionnaire";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { bidderRouter } from './bidder';
import { globalRouter } from "./global";

export const appRouter = router({
  auth: authRouter,
  user:userRouter,
  admin:adminRouter,
  auctionnaire:auctionnaireRouter,
  bidder:bidderRouter,
  global:globalRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

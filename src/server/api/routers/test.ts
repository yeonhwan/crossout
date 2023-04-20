import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { prisma } from '../../db';


export const testRouter = createTRPCRouter({
  update : publicProcedure
  .input(z.object({input: z.string()}))
  .mutation(async ({input, ctx}) => {
    const res = await ctx.prisma.example.create({
      data: {
        testString : input.input
      }
    })
    console.log('create');
    return res;
  }),

  getAll : publicProcedure.query(({ctx}) => {
    return ctx.prisma.example.findMany()
  })
})
import { createTRPCRouter } from "@/server/api/trpc";

// API
import upsertEditorContent from "@/server/api/routers/dayLogAPI/upsertEditorContent";
import upsertDaylog from "@/server/api/routers/dayLogAPI/upsertDaylog";
import getDaylog from "@/server/api/routers/dayLogAPI/getDaylog";

export const daylogRouter = createTRPCRouter({
  upsertEditorContent,
  upsertDaylog,
  getDaylog,
});

export type DaylogRouter = typeof daylogRouter;

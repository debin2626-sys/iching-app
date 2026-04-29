import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const rows = await p.dailyLesson.findMany({
  where: { school: "yijing", locale: "zh", dayIndex: { gte: 1, lte: 7 } },
  select: { dayIndex: true, slug: true, title: true },
  orderBy: { dayIndex: "asc" }
});
console.table(rows);
await p.$disconnect();

import { Resend } from "resend"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  const resend = new Resend(process.env.RESEND_API_KEY)

  const lesson = await prisma.dailyLesson.findFirst({
    where: { school: "yijing", dayIndex: 1, locale: "zh" }
  })
  if (!lesson) throw new Error("no lesson")
  console.log("Lesson:", lesson.title, "wisdomLen:", lesson.wisdom.length)

  const parts = []
  parts.push("<h1>" + lesson.title + "</h1>")
  parts.push("<p style='color:#888'>" + lesson.subtitle + "</p>")
  parts.push("<blockquote style='border-left:4px solid #d4a574;padding:8px 16px;background:#faf6f0'>" + lesson.classicText + "</blockquote>")
  parts.push("<p style='line-height:1.8'>" + lesson.wisdom + "</p>")
  parts.push("<p style='margin-top:20px'><strong>今日行动：</strong>" + lesson.action + "</p>")
  const html = parts.join("")

  const r = await resend.emails.send({
    from: "51yijing <noreply@51yijing.com>",
    to: process.env.RECEIVER ?? "ggs0481@sina.com",
    subject: "测试发信 第1天 " + lesson.title,
    html: html,
  })
  console.log(JSON.stringify(r, null, 2))
  await pool.end()
}

main().catch(function(e) { console.error(e); process.exit(1) })

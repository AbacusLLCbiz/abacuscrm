import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const days = Math.min(Math.max(Number(url.searchParams.get("days") || "30"), 1), 90)

  // Use $queryRawUnsafe — days is validated as an integer above (no injection risk)
  const [trend, totals, topPages] = await Promise.all([
    prisma.$queryRawUnsafe<{ date: string; pageviews: number }[]>(`
      SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date,
             COUNT(*)::int as pageviews
      FROM "PageView"
      WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `),
    prisma.$queryRawUnsafe<{ pageviews: number; sessions: number }[]>(`
      SELECT COUNT(*)::int as pageviews,
             COUNT(DISTINCT "sessionId")::int as sessions
      FROM "PageView"
      WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
    `),
    prisma.$queryRawUnsafe<{ path: string; views: number }[]>(`
      SELECT path, COUNT(*)::int as views
      FROM "PageView"
      WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `),
  ])

  const totalsRow = totals[0] ?? { pageviews: 0, sessions: 0 }

  return NextResponse.json({
    configured: true,
    days,
    trend: trend.map((r) => ({ date: r.date, pageviews: r.pageviews })),
    totals: { pageviews: totalsRow.pageviews, sessions: totalsRow.sessions },
    topPages: topPages.map((r) => ({ path: r.path, views: r.views })),
  })
})

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const days = Math.min(Math.max(Number(url.searchParams.get("days") || "30"), 1), 90)

  // Use $queryRawUnsafe — days is validated as an integer above (no injection risk)
  try {
    const [trend, totals, topPages] = await Promise.all([
      prisma.$queryRawUnsafe<{ date: string; pageviews: number }[]>(`
        SELECT TO_CHAR(DATE("createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') as date,
               COUNT(*)::int as pageviews
        FROM "PageView"
        WHERE "createdAt" >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
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
      trend: trend.map((r) => ({ date: r.date, pageviews: Number(r.pageviews) })),
      totals: { pageviews: Number(totalsRow.pageviews), sessions: Number(totalsRow.sessions) },
      topPages: topPages.map((r) => ({ path: r.path, views: Number(r.views) })),
    })
  } catch (err) {
    // PageView table may not exist yet — return empty data so the UI shows the "no data" state
    // rather than an error. The table is created automatically on the next deploy via prisma db push.
    console.error("[analytics] query failed:", err)
    return NextResponse.json({
      configured: true,
      days,
      trend: [],
      totals: { pageviews: 0, sessions: 0 },
      topPages: [],
    })
  }
})

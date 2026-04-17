import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Proxy to PostHog's HogQL query API — keeps POSTHOG_PERSONAL_API_KEY server-side only
export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projectId = process.env.POSTHOG_PROJECT_ID
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "")

  if (!projectId || !apiKey) {
    return NextResponse.json({ configured: false })
  }

  const url = new URL(req.url)
  const days = Math.min(Number(url.searchParams.get("days") || "30"), 90)

  const queryEndpoint = `${host}/api/projects/${projectId}/query/`
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }

  // Run three queries in parallel
  const [trendRes, topPagesRes, sessionsRes] = await Promise.allSettled([
    fetch(queryEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT toDate(timestamp) AS date, count() AS pageviews
            FROM events
            WHERE event = '$pageview'
              AND timestamp >= now() - INTERVAL ${days} DAY
            GROUP BY date
            ORDER BY date ASC
          `.trim(),
        },
      }),
    }),
    fetch(queryEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT properties.$current_url AS url, count() AS views
            FROM events
            WHERE event = '$pageview'
              AND timestamp >= now() - INTERVAL ${days} DAY
              AND properties.$current_url IS NOT NULL
            GROUP BY url
            ORDER BY views DESC
            LIMIT 10
          `.trim(),
        },
      }),
    }),
    fetch(queryEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT
              count() AS total_pageviews,
              count(DISTINCT properties.$session_id) AS sessions
            FROM events
            WHERE event = '$pageview'
              AND timestamp >= now() - INTERVAL ${days} DAY
          `.trim(),
        },
      }),
    }),
  ])

  const safeJson = async (res: PromiseSettledResult<Response>) => {
    if (res.status === "rejected") return null
    if (!res.value.ok) return null
    try { return await res.value.json() } catch { return null }
  }

  const [trend, topPages, totals] = await Promise.all([
    safeJson(trendRes),
    safeJson(topPagesRes),
    safeJson(sessionsRes),
  ])

  // trend.results: [[date, count], ...]
  const trendRows: [string, number][] = trend?.results ?? []
  // totals.results: [[total_pageviews, sessions]]
  const totalsRow: [number, number] = totals?.results?.[0] ?? [0, 0]
  // topPages.results: [[url, count], ...]
  const topPagesRows: [string, number][] = topPages?.results ?? []

  return NextResponse.json({
    configured: true,
    days,
    trend: trendRows.map(([date, pageviews]) => ({ date, pageviews })),
    totals: { pageviews: totalsRow[0] ?? 0, sessions: totalsRow[1] ?? 0 },
    topPages: topPagesRows.map(([url, views]) => ({ url, views })),
  })
})

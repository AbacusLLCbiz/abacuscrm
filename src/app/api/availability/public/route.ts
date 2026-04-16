import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const eventType = await prisma.eventType.findUnique({
    where: { slug },
    include: { availability: { orderBy: { dayOfWeek: "asc" } } },
  })

  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(eventType.availability)
}

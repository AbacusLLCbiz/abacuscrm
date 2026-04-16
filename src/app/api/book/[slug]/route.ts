import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const eventType = await prisma.eventType.findUnique({
    where: { slug, isActive: true },
  })

  if (!eventType) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(eventType)
}

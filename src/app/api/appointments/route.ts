import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const appointments = await prisma.appointment.findMany({
    where: { startAt: { gte: yesterday } },
    include: {
      client: true,
      eventType: true,
      staffUser: { select: { name: true } },
    },
    orderBy: { startAt: "asc" },
  })

  return NextResponse.json(appointments)
})

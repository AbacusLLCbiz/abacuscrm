import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { runAutomations } from "@/lib/run-automations"

export const POST = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: { id: true, clientId: true, checkedInAt: true },
  })
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.appointment.update({
    where: { id },
    data: { checkedInAt: new Date() },
  })

  // Fire automations async — don't block the response
  runAutomations("APPOINTMENT_CHECKED_IN", {
    clientId: appointment.clientId,
    appointmentId: id,
  }).catch(console.error)

  return NextResponse.json(updated)
})

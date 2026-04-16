import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAutomationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  trigger: z.enum([
    "DOCUMENT_UPLOADED", "DOCUMENT_REQUEST_DUE", "APPOINTMENT_BOOKED",
    "APPOINTMENT_CONFIRMED", "APPOINTMENT_CANCELLED", "APPOINTMENT_REMINDER_24H",
    "APPOINTMENT_REMINDER_1H", "CLIENT_CREATED", "DOCUMENT_REVIEWED", "CUSTOM_DATE",
  ]),
  triggerDaysBefore: z.number().int().optional(),
  triggerDateField: z.string().optional(),
  action: z.enum(["SEND_EMAIL", "SEND_SMS", "REQUEST_DOCUMENTS", "CREATE_REMINDER", "WEBHOOK"]),
  actionConfig: z.record(z.string(), z.unknown()),
  isActive: z.boolean().default(true),
})

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rules = await prisma.automationRule.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(rules)
})

export const POST = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createAutomationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { actionConfig, ...rest } = parsed.data
  const rule = await prisma.automationRule.create({
    data: { ...rest, actionConfig: actionConfig as object },
  })

  return NextResponse.json({ id: rule.id }, { status: 201 })
})

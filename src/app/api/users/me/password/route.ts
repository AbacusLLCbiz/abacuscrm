import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export const PATCH = auth(async (req) => {
  if (!req.auth?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { id: req.auth.user.id },
    select: { passwordHash: true },
  })

  if (!user?.passwordHash) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
  if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({
    where: { id: req.auth.user.id },
    data: { passwordHash: newHash },
  })

  return NextResponse.json({ ok: true })
})

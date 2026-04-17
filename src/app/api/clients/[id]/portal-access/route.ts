import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const schema = z.object({
  password: z.string().min(6),
  enablePortal: z.boolean().default(true),
})

// POST — set a temporary password and enable portal access for a client
export const POST = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  // Find or create a User record for this client
  let portalUser = client.portalUserId
    ? await prisma.user.findUnique({ where: { id: client.portalUserId } })
    : await prisma.user.findUnique({ where: { email: client.email } })

  if (portalUser) {
    // Update existing user password
    await prisma.user.update({
      where: { id: portalUser.id },
      data: { passwordHash, isActive: parsed.data.enablePortal },
    })
  } else {
    // Create new portal user
    portalUser = await prisma.user.create({
      data: {
        email: client.email,
        name: `${client.firstName} ${client.lastName}`,
        passwordHash,
        role: "CLIENT",
        isActive: parsed.data.enablePortal,
        phone: client.phone,
      },
    })
  }

  // Link the portal user to the client
  await prisma.client.update({
    where: { id },
    data: {
      portalUserId: portalUser.id,
      portalEnabled: parsed.data.enablePortal,
    },
  })

  return NextResponse.json({ ok: true, email: client.email })
})

// DELETE — revoke portal access
export const DELETE = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

  if (client.portalUserId) {
    await prisma.user.update({
      where: { id: client.portalUserId },
      data: { isActive: false },
    })
  }

  await prisma.client.update({
    where: { id },
    data: { portalEnabled: false },
  })

  return NextResponse.json({ ok: true })
})

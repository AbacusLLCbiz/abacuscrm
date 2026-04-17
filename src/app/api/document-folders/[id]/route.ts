import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const folder = await prisma.documentFolder.update({ where: { id }, data: parsed.data })
  return NextResponse.json(folder)
})

export const DELETE = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const count = await prisma.document.count({ where: { folderId: id } })
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete folder — it contains ${count} document${count === 1 ? "" : "s"}. Move or delete the documents first.` },
      { status: 400 }
    )
  }

  await prisma.documentFolder.delete({ where: { id } })
  return NextResponse.json({ success: true })
})

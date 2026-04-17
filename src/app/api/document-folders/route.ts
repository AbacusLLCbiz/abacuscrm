import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createFolderSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const folders = await prisma.documentFolder.findMany({
    include: { _count: { select: { documents: true } } },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(folders)
})

export const POST = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createFolderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const folder = await prisma.documentFolder.create({ data: parsed.data })
  return NextResponse.json({ id: folder.id }, { status: 201 })
})

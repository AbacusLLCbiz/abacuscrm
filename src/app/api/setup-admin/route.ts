import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// ONE-TIME USE — delete this file after creating the admin account
export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.user.findUnique({
    where: { email: "admin@abacusllc.biz" },
  })

  if (existing) {
    return NextResponse.json({ message: "Admin already exists" })
  }

  const passwordHash = await bcrypt.hash("Abacus2024!", 12)

  const user = await prisma.user.create({
    data: {
      email: "admin@abacusllc.biz",
      name: "Admin",
      role: "ADMIN",
      passwordHash,
      isActive: true,
    },
  })

  return NextResponse.json({ message: "Admin created", id: user.id })
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(1000).optional(),
})

// Public — no auth
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid rating" }, { status: 400 })

  const review = await prisma.review.findUnique({ where: { token } })
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Only record the first submission
  if (review.submittedAt) {
    const redirect = review.rating && review.rating >= review.minRating ? review.googleUrl : null
    return NextResponse.json({ alreadySubmitted: true, redirect })
  }

  const updated = await prisma.review.update({
    where: { token },
    data: {
      rating: parsed.data.rating,
      feedback: parsed.data.feedback,
      submittedAt: new Date(),
    },
  })

  const redirect = parsed.data.rating >= review.minRating ? review.googleUrl : null
  return NextResponse.json({ ok: true, redirect, lang: updated.lang })
}

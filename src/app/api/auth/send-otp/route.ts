import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSMS, generateOtp } from "@/lib/twilio"
import { z } from "zod"
import bcrypt from "bcryptjs"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = schema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash || !user.isActive) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // If Twilio isn't configured, tell the client to skip OTP and sign in directly
    const smsEnabled = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    )
    if (!smsEnabled) {
      return Response.json({ smsDisabled: true })
    }

    if (!user.phone) {
      return Response.json({ error: "No phone number on file for 2FA" }, { status: 400 })
    }

    // Invalidate old OTPs
    await prisma.otpCode.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    })

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpCode.create({
      data: { userId: user.id, code, expiresAt },
    })

    await sendSMS(
      user.phone,
      `Your Abacus Accounting verification code is: ${code}. Valid for 10 minutes.`
    )

    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

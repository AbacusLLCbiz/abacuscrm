import { NextResponse } from "next/server"
import { getFirmTimezone } from "@/lib/firm-timezone"

export const dynamic = "force-dynamic"

export async function GET() {
  const timezone = await getFirmTimezone()
  return NextResponse.json({ timezone })
}

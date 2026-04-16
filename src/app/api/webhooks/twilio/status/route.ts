import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const STATUS_MAP: Record<string, string> = {
  "queued": "INITIATED",
  "initiated": "INITIATED",
  "ringing": "RINGING",
  "in-progress": "IN_PROGRESS",
  "completed": "COMPLETED",
  "failed": "FAILED",
  "busy": "BUSY",
  "no-answer": "NO_ANSWER",
  "canceled": "CANCELLED",
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const callSid = formData.get("CallSid") as string
  const callStatus = formData.get("CallStatus") as string
  const duration = formData.get("CallDuration") as string | null
  const recordingUrl = formData.get("RecordingUrl") as string | null

  await prisma.phoneCall.updateMany({
    where: { twilioCallSid: callSid },
    data: {
      status: (STATUS_MAP[callStatus] ?? "COMPLETED") as "COMPLETED",
      durationSeconds: duration ? parseInt(duration) : undefined,
      recordingUrl: recordingUrl ?? undefined,
      endedAt: callStatus === "completed" ? new Date() : undefined,
    },
  })

  return new Response("OK")
}

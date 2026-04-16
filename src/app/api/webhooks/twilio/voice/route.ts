import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// Twilio sends form-encoded POST to this webhook for inbound calls
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const callSid = formData.get("CallSid") as string
  const from = formData.get("From") as string
  const to = formData.get("To") as string
  const callStatus = formData.get("CallStatus") as string

  // Look up client by phone number
  const client = await prisma.client.findFirst({
    where: { phone: from },
  })

  // Log the call
  await prisma.phoneCall.upsert({
    where: { twilioCallSid: callSid },
    create: {
      twilioCallSid: callSid,
      direction: "INBOUND",
      status: "IN_PROGRESS",
      fromNumber: from,
      toNumber: to,
      clientId: client?.id,
    },
    update: {
      status: callStatus.toUpperCase().replace("-", "_") as "IN_PROGRESS",
    },
  })

  // TwiML response — connects to browser client or plays message
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Thank you for calling Abacus Accounting. Please hold while we connect you.
  </Say>
  <Dial>
    <Client>staff</Client>
  </Dial>
</Response>`

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  })
}

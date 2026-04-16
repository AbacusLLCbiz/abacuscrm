import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export { client as twilioClient }

export const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER ?? ""

export async function sendSMS(to: string, body: string) {
  return client.messages.create({
    from: TWILIO_PHONE,
    to,
    body,
  })
}

// Outbound voice call — plays a TwiML message or connects to a conference
export async function makeCall({
  to,
  twimlUrl,
  statusCallbackUrl,
}: {
  to: string
  twimlUrl: string
  statusCallbackUrl?: string
}) {
  return client.calls.create({
    from: TWILIO_PHONE,
    to,
    url: twimlUrl,
    statusCallback: statusCallbackUrl,
    statusCallbackMethod: "POST",
  })
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

import { Resend } from "resend"

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder")
  return _resend
}

export const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@abacusaccounting.com"
export const FROM_NAME = process.env.FROM_NAME ?? "Abacus Accounting"

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  return getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  })
}

export function renderTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, key) => {
    return key.split(".").reduce((obj: Record<string, unknown>, k: string) => {
      return (obj as Record<string, unknown>)?.[k] as Record<string, unknown>
    }, vars as unknown as Record<string, unknown>) as unknown as string ?? ""
  })
}

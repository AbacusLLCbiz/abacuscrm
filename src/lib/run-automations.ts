import { AutomationTrigger, Prisma } from "@prisma/client"
import { prisma } from "./prisma"
import { sendEmail, renderTemplate } from "./resend"

export interface AutomationContext {
  clientId: string
  appointmentId?: string
}

/** Fire all active rules matching `trigger` for the given context. */
export async function runAutomations(trigger: AutomationTrigger, ctx: AutomationContext) {
  const rules = await prisma.automationRule.findMany({
    where: { trigger, isActive: true },
  })

  for (const rule of rules) {
    let success = false
    let error: string | undefined
    try {
      await executeRule(rule, ctx)
      success = true
    } catch (err) {
      error = String(err)
      console.error(`[automation] rule ${rule.id} failed:`, err)
    }

    await prisma.automationLog.create({
      data: {
        ruleId: rule.id,
        clientId: ctx.clientId,
        triggerPayload: ctx as unknown as Prisma.InputJsonValue,
        actionResult: Prisma.JsonNull,
        success,
        error,
      },
    })
  }
}

async function executeRule(
  rule: { action: string; actionConfig: Prisma.JsonValue },
  ctx: AutomationContext
) {
  const cfg = (rule.actionConfig ?? {}) as Record<string, unknown>
  const client = await prisma.client.findUniqueOrThrow({ where: { id: ctx.clientId } })

  const lang = client.preferredLanguage === "ES" ? "ES" : "EN"
  const vars = { firstName: client.firstName, lastName: client.lastName, email: client.email }
  const t = (field: string) => {
    // Pick language-specific version if available, else fall back to base
    const langKey = `${field}_${lang.toLowerCase()}`
    const val = String(cfg[langKey] || cfg[field] || "")
    return renderTemplate(val, vars)
  }

  switch (rule.action) {
    case "SEND_EMAIL": {
      const to = cfg.to === "client" ? client.email : String(cfg.to || client.email)
      await sendEmail({
        to,
        subject: t("subject"),
        html: t("body").replace(/\n/g, "<br>"),
      })
      break
    }

    case "REQUEST_REVIEW": {
      if (!ctx.appointmentId) throw new Error("appointmentId required for REQUEST_REVIEW")
      const minRating = Number(cfg.minRating ?? 4)
      const googleUrl = String(cfg.googleUrl || "")

      const review = await prisma.review.create({
        data: {
          appointmentId: ctx.appointmentId,
          clientId: ctx.clientId,
          minRating,
          googleUrl: googleUrl || null,
          lang,
        },
      })

      const baseUrl = (process.env.AUTH_URL || "https://abacuscrm-production.up.railway.app").replace(/\/$/, "")
      const reviewUrl = `${baseUrl}/review/${review.token}`

      await sendEmail({
        to: client.email,
        subject: t("subject") || (lang === "ES" ? "¿Cómo fue su experiencia?" : "How was your experience?"),
        html: buildReviewEmail({
          firstName: client.firstName,
          reviewUrl,
          body: t("body"),
          lang,
        }),
      })
      break
    }

    default:
      break
  }
}

function buildReviewEmail({
  firstName,
  reviewUrl,
  body,
  lang,
}: {
  firstName: string
  reviewUrl: string
  body: string
  lang: string
}) {
  const isEs = lang === "ES"
  const heading = isEs ? `Hola ${firstName} 👋` : `Hi ${firstName} 👋`
  const defaultBody = isEs
    ? "¡Gracias por visitarnos hoy! Nos encantaría saber cómo fue su experiencia. Solo toma un segundo."
    : "Thank you for coming in today! We'd love to hear how your experience went. It only takes a second."
  const rateText = isEs ? "¿Cómo calificaría su experiencia?" : "How would you rate your experience?"
  const clickText = isEs ? "Haga clic en una estrella para dejar su calificación" : "Click a star to leave your rating"

  const starButtons = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${reviewUrl}?rating=${n}" style="display:inline-block;width:52px;height:52px;line-height:52px;border-radius:12px;background:#f1f5f9;text-align:center;text-decoration:none;font-size:24px;margin:0 3px;border:2px solid #e2e8f0;">★</a>`
    )
    .join("")
  const starNums = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<span style="display:inline-block;width:52px;text-align:center;font-size:11px;color:#94a3b8;margin:0 3px;">${n}</span>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="${lang.toLowerCase()}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
  <tr><td style="background:#1e3a8a;padding:28px 40px;text-align:center;">
    <p style="margin:0;font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">abacus <span style="color:#93c5fd;">accounting</span></p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">${heading}</h2>
    <p style="margin:0 0 28px;color:#475569;line-height:1.6;font-size:15px;">${body || defaultBody}</p>
    <p style="margin:0 0 16px;font-weight:600;font-size:15px;color:#0f172a;text-align:center;">${rateText}</p>
    <div style="text-align:center;margin:0 0 8px;">${starButtons}</div>
    <div style="text-align:center;margin:0 0 28px;">${starNums}</div>
    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">${clickText}</p>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Abacus Accounting, LLC</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

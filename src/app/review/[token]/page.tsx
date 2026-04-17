"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { CheckCircle2, AlertCircle, Star } from "lucide-react"

type Phase = "rating" | "submitting" | "high" | "low" | "already" | "error"

const copy = {
  EN: {
    tagline: "Client Portal",
    heading: "How was your experience?",
    sub: "Your feedback helps us serve you better.",
    stars: ["Terrible", "Bad", "Okay", "Good", "Excellent"],
    submitting: "Saving your rating…",
    high_heading: "Thank you so much! 🎉",
    high_body: "We're thrilled you had a great experience. Would you mind sharing it on Google? It means a lot to us.",
    high_btn: "Leave a Google Review",
    high_skip: "No thanks",
    low_heading: "Thank you for letting us know.",
    low_body: "We're sorry to hear your visit wasn't perfect. Your feedback helps us improve — thank you for taking the time.",
    low_label: "Anything you'd like to add? (optional)",
    low_placeholder: "Tell us more…",
    low_btn: "Submit feedback",
    low_done: "Thank you. We'll work on it! 💙",
    already: "Already submitted",
    already_body: "Looks like you've already rated this visit. Thank you!",
    error: "Something went wrong",
    error_body: "This review link may be invalid or expired.",
  },
  ES: {
    tagline: "Portal del Cliente",
    heading: "¿Cómo fue su experiencia?",
    sub: "Su opinión nos ayuda a servirle mejor.",
    stars: ["Terrible", "Mala", "Regular", "Buena", "Excelente"],
    submitting: "Guardando su calificación…",
    high_heading: "¡Muchas gracias! 🎉",
    high_body: "Nos alegra que haya tenido una gran experiencia. ¿Le importaría compartirla en Google? Significa mucho para nosotros.",
    high_btn: "Dejar una reseña en Google",
    high_skip: "No, gracias",
    low_heading: "Gracias por avisarnos.",
    low_body: "Lamentamos que su visita no haya sido perfecta. Su opinión nos ayuda a mejorar. ¡Gracias por su tiempo!",
    low_label: "¿Algo más que quiera añadir? (opcional)",
    low_placeholder: "Cuéntenos más…",
    low_btn: "Enviar comentarios",
    low_done: "Gracias. ¡Trabajaremos en ello! 💙",
    already: "Ya enviado",
    already_body: "Parece que ya calificó esta visita. ¡Gracias!",
    error: "Algo salió mal",
    error_body: "Este enlace puede ser inválido o haber expirado.",
  },
}

export default function ReviewPage() {
  const { token } = useParams<{ token: string }>()
  const searchParams = useSearchParams()
  const ratingParam = Number(searchParams.get("rating") || "0")

  const [lang, setLang] = useState<"EN" | "ES">("EN")
  const [phase, setPhase] = useState<Phase>("rating")
  const [googleUrl, setGoogleUrl] = useState<string | null>(null)
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [feedbackDone, setFeedbackDone] = useState(false)

  const c = copy[lang]

  const submit = async (rating: number, fb?: string) => {
    setPhase("submitting")
    try {
      const res = await fetch(`/api/review/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback: fb }),
      })
      const data = await res.json()
      if (data.lang) setLang(data.lang === "ES" ? "ES" : "EN")
      if (data.alreadySubmitted) { setPhase("already"); return }
      if (data.redirect) {
        setGoogleUrl(data.redirect)
        setPhase("high")
      } else {
        setPhase("low")
      }
    } catch {
      setPhase("error")
    }
  }

  // If rating came in via URL param (from email link), auto-submit
  useEffect(() => {
    if (ratingParam >= 1 && ratingParam <= 5) {
      submit(ratingParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-10 text-center">
        <p className="text-2xl font-black tracking-tight">
          <span className="text-[#1e3a8a]">abacus</span>{" "}
          <span className="text-[#60a5fa]">accounting</span>
        </p>
        <p className="text-xs text-[#94a3b8] mt-1">{c.tagline}</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8">

        {/* ── Rating phase ── */}
        {phase === "rating" && (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">{c.heading}</h1>
              <p className="text-sm text-[#64748b] mt-1">{c.sub}</p>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => { setSelected(n); submit(n) }}
                  className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-110"
                  aria-label={`${n} star`}
                >
                  <Star
                    className="h-10 w-10 transition-colors"
                    fill={(hover || selected) >= n ? "#f59e0b" : "none"}
                    stroke={(hover || selected) >= n ? "#f59e0b" : "#cbd5e1"}
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] text-[#94a3b8]">{n}</span>
                </button>
              ))}
            </div>
            {hover > 0 && (
              <p className="text-sm font-medium text-[#64748b]">{c.stars[hover - 1]}</p>
            )}
          </div>
        )}

        {/* ── Submitting ── */}
        {phase === "submitting" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e40af] border-t-transparent" />
            <p className="text-sm text-[#64748b]">{c.submitting}</p>
          </div>
        )}

        {/* ── High rating ── */}
        {phase === "high" && (
          <div className="text-center space-y-5">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h2 className="text-lg font-bold text-[#0f172a]">{c.high_heading}</h2>
              <p className="text-sm text-[#64748b] mt-1">{c.high_body}</p>
            </div>
            {googleUrl && (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-[#1e40af] text-white text-sm font-semibold py-3 px-4 hover:bg-[#1e3a8a] transition-colors"
              >
                {c.high_btn} →
              </a>
            )}
            <button
              onClick={() => setPhase("already")}
              className="text-xs text-[#94a3b8] hover:text-[#64748b]"
            >
              {c.high_skip}
            </button>
          </div>
        )}

        {/* ── Low rating ── */}
        {phase === "low" && !feedbackDone && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-bold text-[#0f172a]">{c.low_heading}</h2>
              <p className="text-sm text-[#64748b] mt-1">{c.low_body}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0f172a]">{c.low_label}</label>
              <textarea
                className="w-full min-h-[100px] rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none"
                placeholder={c.low_placeholder}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <button
              onClick={async () => {
                if (feedback.trim()) {
                  await fetch(`/api/review/${token}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rating: selected || 1, feedback }),
                  })
                }
                setFeedbackDone(true)
              }}
              className="w-full rounded-xl bg-[#1e40af] text-white text-sm font-semibold py-3 px-4 hover:bg-[#1e3a8a] transition-colors"
            >
              {c.low_btn}
            </button>
          </div>
        )}

        {phase === "low" && feedbackDone && (
          <div className="text-center py-6">
            <CheckCircle2 className="h-10 w-10 text-[#1e40af] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#0f172a]">{c.low_done}</p>
          </div>
        )}

        {/* ── Already submitted ── */}
        {phase === "already" && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="h-10 w-10 text-[#94a3b8] mx-auto" />
            <p className="font-semibold text-[#0f172a]">{c.already}</p>
            <p className="text-sm text-[#64748b]">{c.already_body}</p>
          </div>
        )}

        {/* ── Error ── */}
        {phase === "error" && (
          <div className="text-center py-4 space-y-3">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
            <p className="font-semibold text-[#0f172a]">{c.error}</p>
            <p className="text-sm text-[#64748b]">{c.error_body}</p>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-[#94a3b8]">
        © {new Date().getFullYear()} Abacus Accounting, LLC
      </p>
    </div>
  )
}

"use client"

import { SessionProvider } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"

export const TimezoneContext = createContext("America/New_York")
export const useTimezone = () => useContext(TimezoneContext)

export default function Providers({ children }: { children: React.ReactNode }) {
  const [tz, setTz] = useState("America/New_York")

  useEffect(() => {
    fetch("/api/settings/timezone")
      .then((r) => r.json())
      .then((d) => { if (d.timezone) setTz(d.timezone) })
      .catch(() => {})
  }, [])

  return (
    <SessionProvider>
      <TimezoneContext.Provider value={tz}>
        {children}
      </TimezoneContext.Provider>
    </SessionProvider>
  )
}

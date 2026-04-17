import { prisma } from "./prisma"

// Simple module-level cache for the server (works in long-running Node.js on Railway)
let _tz: string | null = null
let _ttl = 0

export async function getFirmTimezone(): Promise<string> {
  if (_tz && Date.now() < _ttl) return _tz
  try {
    const s = await prisma.firmSettings.findUnique({ where: { id: "default" } })
    _tz = s?.timezone ?? "America/New_York"
  } catch {
    _tz = "America/New_York"
  }
  _ttl = Date.now() + 5 * 60 * 1000 // 5-minute cache
  return _tz!
}

export function invalidateTimezoneCache() {
  _tz = null
  _ttl = 0
}

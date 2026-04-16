export interface EventType {
  id: string
  slug: string
  title: string
  description: string | null
  duration: number
  active: boolean
  createdAt: string
}

export interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface Appointment {
  id: string
  eventTypeId: string
  clientName: string
  clientEmail: string
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  notes: string | null
}

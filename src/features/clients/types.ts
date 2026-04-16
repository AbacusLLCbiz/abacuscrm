export interface ClientRow {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  company: string | null
  entityType: string | null
  status: "ACTIVE" | "INACTIVE" | "PROSPECT"
  fiscalYearEnd: string | null
  assignedTo: { name: string | null }
  tags: string[]
  createdAt: string
}

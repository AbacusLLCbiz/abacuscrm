import { z } from "zod"

export const createClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  entityType: z.enum(["INDIVIDUAL", "SOLE_PROPRIETOR", "LLC", "S_CORP", "C_CORP", "PARTNERSHIP", "NON_PROFIT", "OTHER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]).default("ACTIVE"),
  fiscalYearEnd: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
